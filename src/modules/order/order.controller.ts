import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Req() req: AuthRequest,) {
        const userId = req.user.id
        const {  address, instructions, phone, paymentMethod } = req.body
        return this.orderService.createOrder({
            userId,
            address,
            instructions,
            phone,
            paymentMethod
        })
    }

    @Post('checkout/:orderId')
    @UseGuards(AuthGuard)
    async checkout(@Req() req: AuthRequest,@Param('orderId') orderId:string) {
        const userId = req.user.id
        return await this.orderService.checkout(orderId, userId)
    }

       @Post('refund/:orderId')
    @UseGuards(AuthGuard)
    async refund(@Req() req: AuthRequest,@Param('orderId') orderId:string) {
        const userId = req.user.id
        return await this.orderService.refund(orderId, userId)
    }

}
