import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { UserModel } from 'src/models/user.model';
import { CartModel } from 'src/models/cart.model';
import { CouponModel } from 'src/models/coupon.model';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { CouponRepo } from 'src/Repos/coupon.repo';

@Module({
  imports: [UserModel,CartModel,CouponModel],
  controllers: [CouponController],
  providers: [CouponService,JwtService,UserRepo,CouponRepo],
})
export class CouponModule {}
