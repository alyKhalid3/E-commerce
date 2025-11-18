
import { ConflictException, Injectable } from '@nestjs/common';
import { OrderRepo } from 'src/Repos/order.repo';
import { CartRepo } from 'src/Repos/cart.repo';
import { PaymentMethodEnum } from 'src/types/order.type';
import { Types } from 'mongoose';
import { IProduct } from 'src/types/product.type';
import { ProductRepo } from 'src/Repos/product.repo';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepo: OrderRepo,
        private readonly cartRepo: CartRepo,
        private readonly productRepo: ProductRepo

    ) { }
    async createOrder({
        userId,
        discount = 0,
        address,
        instructions = [],
        phone,
        paymentMethod = PaymentMethodEnum.CASH
    }: {
        userId: Types.ObjectId,
        discount?: number,
        address: string,
        instructions?: string[],
        phone: string,
        paymentMethod?: PaymentMethodEnum,
    }) {
        const cart = await this.cartRepo.findOne({
            filter: { user: userId },
            options: {
                populate: 'items.product'
            }
        })
        if (!cart || cart.items.length == 0) {
            throw new ConflictException("Cart is empty")
        }


        const subtotal = cart.items.reduce((totalPrice: number, item) => {
            return totalPrice + ((item.product as unknown as IProduct).salePrice * item.quantity as any)
        }, 0)
        const total = subtotal - (discount == 0 ? 0 : (discount / 100)) * subtotal


        const order = await this.orderRepo.create({
            user: userId,
            items: cart.items,
            subtotal,
            discount,
            total,
            address,
            instructions,
            phone,
            paymentMethod
        })

        for (const item of cart.items) {
            await this.productRepo.update({
                filter: { _id: item.product },
                data: {
                    $inc: {
                        stock: -item.quantity,
                        soldItems:+item.quantity
                    }
                }
            })
        }
        await cart.updateOne({ items: [] })
        return {
            data: {
                order
            }
        }

    }
}
