import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModel } from 'src/models/user.model';
import { OrderModel } from 'src/models/order.model';
import { CartModel } from 'src/models/cart.model';
import { JwtService } from '@nestjs/jwt';
import { CartRepo } from 'src/Repos/cart.repo';
import { OrderRepo } from 'src/Repos/order.repo';
import { ProductRepo } from 'src/Repos/product.repo';
import { ProductModel } from 'src/models/product.model';
import { UserRepo } from 'src/Repos/user.repo';
import { PaymentService } from 'src/common/services/payment/payment.service';

@Module({
  imports: [
    UserModel,
    OrderModel,
    CartModel,
    ProductModel


  ],
  controllers: [OrderController],
  providers: [OrderService,JwtService,UserRepo,CartRepo,OrderRepo,ProductRepo,PaymentService]
})
export class OrderModule {}
