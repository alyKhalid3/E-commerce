import { ObjectId, Types } from 'mongoose';

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepo } from 'src/Repos/cart.repo';
import { ProductRepo } from 'src/Repos/product.repo';

@Injectable()
export class CartService {

    constructor(
        private readonly cartRepo: CartRepo,
        private readonly productRepo: ProductRepo
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

        const isProductExist = await this.productRepo.findOne({
            filter: {
                _id: productId,

            }
        })
        if (!isProductExist) {
            throw new ConflictException("Product not found")
        }
        if (quantity > isProductExist.stock) {
            throw new BadRequestException(`available quantity is ${isProductExist.stock}`)
        }
        let cart = await this.cartRepo.findOne({
            filter: { user: userId }
        })
        if (!cart) {
            cart = await this.cartRepo.create({
                items: [{
                    product: productId,
                    quantity
                }],
                user: userId
            })
            return {
                data: cart
            }
        }

        const index = cart.items.findIndex((item) => item.product.equals(productId))
        if (index == -1) {
            if (quantity > isProductExist.stock) {
                throw new BadRequestException(`available quantity is ${isProductExist.stock}`)
            }
            cart.items.push({
                product: productId,
                quantity
            })
            await cart.save()
            return {
                data: cart
            }
        }
        const totalQuantity = cart.items[index].quantity + quantity
        if (totalQuantity > isProductExist.stock) {
            cart.items[index].quantity = isProductExist.stock
            await cart.save()
            throw new NotFoundException(`available quantity is ${isProductExist.stock}`)
        }
        cart.items[index].quantity = totalQuantity
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
        if(!cart|| cart.items.length == 0){
            throw new ConflictException("Cart is empty")
        }
        const index=cart.items.findIndex((item) => item.product.equals(productId))

        if (index == -1) {
            throw new NotFoundException("Product not found")
        }
        cart.items.splice(index, 1)
        await cart.save()
        return {
            data: cart
        }
       
    }
}