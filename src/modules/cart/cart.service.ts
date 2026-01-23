import { ObjectId, Types } from 'mongoose';

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepo } from 'src/Repos/cart.repo';
import { ProductRepo } from 'src/Repos/product.repo';
import { CouponRepo } from 'src/Repos/coupon.repo';

@Injectable()
export class CartService {

    constructor(
        private readonly cartRepo: CartRepo,
        private readonly productRepo: ProductRepo,
        private readonly couponRepo: CouponRepo
    ) { }


    async getCart(userId: Types.ObjectId) {
        let cart = await this.cartRepo.findOne({
            filter: { user: userId },
            options: {
                populate: [{
                    path: "items.product",
                    select: "name"
                }]
            }
        });

        if (!cart) {
            cart = await this.cartRepo.create({
                items: [], user: userId

            });
        }


        return {
            data: cart
        }

    }

    async addToCart(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number) {

        const product = await this.productRepo.findOne({ filter: { _id: productId } });

        if (!product) throw new NotFoundException("Product not found");

        const price = product.salePrice || product.originalPrice;
        const total = price * quantity;

        if (quantity > product.stock) {
            throw new BadRequestException(`Available quantity is ${product.stock}`);
        }

        let cart = await this.cartRepo.findOne({ filter: { user: userId } });


        if (!cart) {
            cart = await this.cartRepo.create({
                user: userId,
                items: [{
                    product: productId,
                    quantity,
                    price,
                    total
                }],
                totalPrice: total
            });
            return { data: cart };
        }


        const index = cart.items.findIndex(item => item.product.equals(productId));


        if (index === -1) {
            cart.items.push({ product: productId, quantity, price, total });
        } else {

            const newQuantity = cart.items[index].quantity + quantity;

            if (newQuantity > product.stock) {
                cart.items[index].quantity = product.stock;
                cart.items[index].total = product.stock * price;

                cart.totalPrice = cart.items.reduce((sum, itm) => sum + itm.total, 0);
                await cart.save();

                throw new BadRequestException(`Available quantity is ${product.stock}`);
            }

            cart.items[index].quantity = newQuantity;
            cart.items[index].total = newQuantity * price;
        }

        cart.totalPrice = cart.items.reduce((sum, itm) => sum + itm.total, 0);
        await cart.save();

        return { data: cart };
    }

    async updateCart(userId: Types.ObjectId, productId: string, quantity: number) {
        const cart = await this.cartRepo.findOne({ filter: { user: userId } })
        if (!cart)
            throw new NotFoundException("Cart not found")
        const index = cart.items.findIndex((item) => item.product.equals(productId))
        if (index == -1)
            throw new NotFoundException("Product not found")
        if (quantity <= 0) {
            cart.items.splice(index, 1)
        }
        else {
            const item = cart.items[index]
            item.quantity = quantity
            item.total = item.quantity * item.price

        }
        cart.totalPrice = cart.items.reduce((sum, itm) => sum + itm.total, 0);
        await cart.save()
        return {
            data: cart
        }
    }
    async removeFromCart(userId: Types.ObjectId, productId: Types.ObjectId) {
        const cart = await this.cartRepo.findOne({
            filter: {
                user: userId,
            }
        })
        if (!cart || cart.items.length == 0) {
            throw new ConflictException("Cart is empty")
        }
        const index = cart.items.findIndex((item) => item.product.equals(productId))

        if (index == -1) {
            throw new NotFoundException("Product not found")
        }
        cart.items.splice(index, 1)
        cart.totalPrice = cart.items.reduce((sum, itm) => sum + itm.total, 0);
        await cart.save()
        return {
            data: cart
        }

    }



    async applyCoupon(userId: Types.ObjectId, code: string) {

        const cart = await this.cartRepo.findOne({ filter: { user: userId } })
        if (!cart)
            throw new BadRequestException("Cart not found")
        if (cart.items.length == 0)
            throw new BadRequestException("Cart is empty")
        const coupon = await this.couponRepo.findOne({ filter: { code } })
        if (!coupon)
            throw new BadRequestException("Coupon not found")
        const now = Date.now()
        if (coupon.expiresAt.getTime() <= now)
            throw new BadRequestException("Coupon expired")
        const discountAmount = (cart.totalPrice * coupon.discount) / 100
        const totalAfterDiscount = cart.totalPrice - discountAmount
        cart.coupon = coupon._id
        cart.discount = coupon.discount
        cart.totalAfterDiscount = totalAfterDiscount
        await cart.save()

        return {
            data: cart
        }
    }
}