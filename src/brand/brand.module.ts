import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandModel } from 'src/models/brand.model';
import { BrandRepo } from 'src/Repos/brand.repo';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { UserModel } from 'src/models/user.model';

@Module({
  imports: [BrandModel,UserModel],
  controllers: [BrandController],
  providers: [BrandService,BrandRepo,JwtService,UserRepo]
})
export class BrandModule {}
