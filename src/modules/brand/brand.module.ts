import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandModel } from 'src/models/brand.model';
import { BrandRepo } from 'src/Repos/brand.repo';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { UserModel } from 'src/models/user.model';
import { ProductModel } from 'src/models/product.model';
import { ProductRepo } from 'src/Repos/product.repo';
import { CartModel } from 'src/models/cart.model';
import { CartRepo } from 'src/Repos/cart.repo';

@Module({
  imports: [BrandModel,UserModel,ProductModel,CartModel],
  controllers: [BrandController],
  providers: [BrandService,BrandRepo,JwtService,UserRepo,ProductRepo,CartRepo]
})
export class BrandModule {}
