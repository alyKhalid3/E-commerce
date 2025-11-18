import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepo } from 'src/Repos/category.repo';
import { CategoryModel } from 'src/models/category.model';
import { UserModel } from 'src/models/user.model';
import { BrandRepo } from 'src/Repos/brand.repo';
import { BrandModel } from 'src/models/brand.model';
import { UserRepo } from 'src/Repos/user.repo';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel,CategoryModel,BrandModel],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepo,BrandRepo,UserRepo,JwtService]
})
export class CategoryModule {}
