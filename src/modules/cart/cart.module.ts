import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from 'src/models/cart.model';
import { ProductModel } from 'src/models/product.model';
import { UserModel } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { ProductRepo } from 'src/Repos/product.repo';
import { CartRepo } from 'src/Repos/cart.repo';
import { CouponModel } from 'src/models/coupon.model';
import { CouponRepo } from 'src/Repos/coupon.repo';

@Module({
  imports: [
    CartModel,
    ProductModel,
    UserModel,
    CouponModel
  ],
  controllers: [CartController],
  providers: [CartService, JwtService, UserRepo, ProductRepo, CartRepo, CouponRepo]
})
export class CartModule { }
