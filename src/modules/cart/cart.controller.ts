import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }


    @Get('/')
    @UseGuards(AuthGuard)

    async getCart(@Req() req: AuthRequest) {
        const userId = req.user.id
        return  await this.cartService.getCart(userId) 
    }

    @Post('/add-to-cart')
    @UseGuards(AuthGuard)
    async addToCart(@Req() req: AuthRequest,) {
        const userId = req.user.id
        const { productId, quantity } = req.body
        return  await this.cartService.addToCart(userId,productId,quantity) 
    }


    @Patch('/:productId')
    @UseGuards(AuthGuard)
    update(@Param('productId') productId: string, @Body('quantity') qutantity: number,@Req() req: AuthRequest) {
        const userId = req.user.id
        return this.cartService.updateCart(userId, productId, qutantity);

    }

    @Delete('/remove-from-cart')
    @UseGuards(AuthGuard)
    async removeFromCart(@Req() req: AuthRequest,) {
        const userId = req.user.id
        const { productId } = req.body
        return  await this.cartService.removeFromCart(userId,productId) 
    }


    @Post('/apply-coupon')
    @UseGuards(AuthGuard)
    async applyCoupon(@Req() req: AuthRequest,@Body('code') code:string) {
        const userId = req.user.id
        
        return  await this.cartService.applyCoupon(userId,code) 
    }
}
