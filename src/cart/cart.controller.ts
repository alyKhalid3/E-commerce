import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
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





    @Delete('/remove-from-cart')
    @UseGuards(AuthGuard)
    async removeFromCart(@Req() req: AuthRequest,) {
        const userId = req.user.id
        const { productId } = req.body
        return  await this.cartService.removeFromCart(userId,productId) 
    }
}
