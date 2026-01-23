import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Types } from 'mongoose';
import { CouponRepo } from 'src/Repos/coupon.repo';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepo: CouponRepo) { }
  async create(createCouponDto: CreateCouponDto, userId: Types.ObjectId) {
    const isCouponExist = await this.couponRepo.findOne({ filter: { code: createCouponDto.code } });
    if (isCouponExist) {
      throw new ConflictException('Coupon already exist');
    }

    return {
      data: await this.couponRepo.create({
        ...createCouponDto,
        createdBy: userId,
        code: createCouponDto.code,
      })
    }
  }

  findAll() {
    return `This action returns all coupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
