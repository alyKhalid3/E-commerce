import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModel } from 'src/models/user.model';
import { BrandModel } from 'src/models/brand.model';
import { CategoryModel } from 'src/models/category.model';
import { ProductModel } from 'src/models/product.model';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { BrandRepo } from 'src/Repos/brand.repo';
import { ProductRepo } from 'src/Repos/product.repo';
import { CategoryRepo } from 'src/Repos/category.repo';

@Module({
  imports: [
    UserModel,
    BrandModel,
    CategoryModel,
    ProductModel
  ],
  controllers: [ProductController],
  providers: [ProductService,JwtService,UserRepo,BrandRepo,ProductRepo,CategoryRepo],
})
export class ProductModule {}
