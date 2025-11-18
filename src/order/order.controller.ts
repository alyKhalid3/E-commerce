import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    @Post('create-order')
    @UseGuards(AuthGuard)
    async createOrder(@Req() req: AuthRequest,) {
        const userId = req.user.id
        const { discount, address, instructions, phone, paymentMethod } = req.body
        return this.orderService.createOrder({
            userId,
            discount,
            address,
            instructions,
            phone,
            paymentMethod
        })
    }

}
