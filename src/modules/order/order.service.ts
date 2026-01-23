import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepo } from 'src/Repos/order.repo';
import { CartRepo } from 'src/Repos/cart.repo';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/types/order.type';
import { Types } from 'mongoose';
import { IProduct } from 'src/types/product.type';
import { ProductRepo } from 'src/Repos/product.repo';
import ca from 'zod/v4/locales/ca.js';
import path from 'path';
import { NotFoundError } from 'rxjs';
import { IHydratedUser } from 'src/types/user.type';
import { PaymentService } from 'src/common/services/payment/payment.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
    private paymentService: PaymentService,
  ) {}
  async createOrder({
    userId,
    address,
    instructions = [],
    phone,
    paymentMethod = PaymentMethodEnum.CASH,
  }: {
    userId: Types.ObjectId;
    discount?: number;
    address: string;
    instructions?: string[];
    phone: string;
    paymentMethod?: PaymentMethodEnum;
  }) {
    const cart = await this.cartRepo.findOne({
      filter: { user: userId },
      options: {
        populate: 'coupon',
      },
    });
    if (!cart || cart.items.length == 0) {
      throw new ConflictException('Cart is empty');
    }

    // const subtotal = cart.totalAfterDiscount || cart.totalPrice
    // const total = subtotal - (discount == 0 ? 0 : (discount / 100)) * subtotal

    const order = await this.orderRepo.create({
      user: userId,
      cart: cart._id,
      items: cart.items,
      subtotal: cart.totalPrice,
      discount: cart.discount || 0,
      coupon: cart.coupon?._id,
      total: cart.totalAfterDiscount || cart.totalPrice,
      address,
      instructions,
      phone,
      paymentMethod,
    });

    for (const item of cart.items) {
      await this.productRepo.update({
        filter: { _id: item.product },
        data: {
          $inc: {
            stock: -item.quantity,
            soldItems: +item.quantity,
          },
        },
      });
    }
    await cart.updateOne({
      items: [],
      totalPrice: 0,
      totalAfterDiscount: 0,
      discount: 0,
      coupon: null,
    });
    return {
      data: {
        order,
      },
    };
  }

  async checkout(id: string, userId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ConflictException('Invalid order id');
    }
    const orderId = new Types.ObjectId(id);

    const order = await this.orderRepo.findOne({
      filter: {
        _id: orderId,
        user: userId,
        paymentMethod: PaymentMethodEnum.CARD,
        orderStatus: OrderStatusEnum.PENDING,
      },
      options: {
        populate: [{ path: 'user' }, { path: 'cart' }, { path: 'coupon' }],
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    const amount = order.subtotal ?? 0;
    const line_items = [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Order ${(order.user as unknown as IHydratedUser).firstName}`,
            description: `Payment for orderr on address ${order.address} `,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ];
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (order.discount) {
      const coupon = await this.paymentService.createCoupon({
        duration: 'once',
        currency: 'egp',
        percent_off: order.discount,
      });
      discounts.push({
        coupon: coupon.id,
      });
    }
    const session = await this.paymentService.checkoutSession({
      line_items,
      customer_email: (order.user as unknown as IHydratedUser).email,
      discounts,
      metadata: { orderId: order._id.toString() },
    });

      // ------------------Payement Intent---------------------
    const method = await this.paymentService.createPaymentMethod({
      type: 'card',
      card: { token: 'tok_visa' },
    });
    const intent = await this.paymentService.createPaymentIntent({
      amount: order.subtotal*100,
      currency: 'egp',
      payment_method: method.id,
      payment_method_types: [PaymentMethodEnum.CARD],
    });
    order.intentId = intent.id;
    await order.save();

    await this.paymentService.confirmPaymentIntent(intent.id);
    return { data: session };
  }

  async refund(id: string, userId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ConflictException('Invalid order id');
    }
    const orderId = new Types.ObjectId(id);

    const order = await this.orderRepo.findOne({
      filter: {
        _id: orderId,
        user: userId,
        paymentMethod: PaymentMethodEnum.CARD,
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (!order.intentId) throw new BadRequestException('Order is not paid');
    const refund = await this.paymentService.createRefund(order.intentId);
   const updatedOrder = await this.orderRepo.update({
      filter: { _id: orderId },
      data: {
        refundId: refund.id,
        orderStatus: OrderStatusEnum.CANCELLED,
        refundedAt: new Date(),
        $unset: { intentId: 1 },

      },
      options: { new: true },
    });
    return { data: updatedOrder };
  }
}
