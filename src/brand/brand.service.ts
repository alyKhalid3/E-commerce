import { ObjectId, Types } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { filter } from 'rxjs';
import { BrandRepo } from 'src/Repos/brand.repo';
import { IBrand } from 'src/types/brand.type.';
import fs from 'fs/promises'

@Injectable()
export class BrandService {
    constructor(private readonly brandRepo: BrandRepo) { }
    async create(data: IBrand) {
        const isExist = await this.brandRepo.findOne({
            filter: {
                name: data.name
            }
        });
        if (isExist) {
            throw new BadRequestException("Brand already exists");
        }

        return await this.brandRepo.create(data)

        
    }
    async updateBrand(brandId: Types.ObjectId, data: IBrand) {
        const brand = await this.brandRepo.findOne({
            filter:{
                _id:brandId,
                createdBy:data.createdBy
            }
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        if(data.name){
            brand.name = data.name
        }
        if(data.image){
            if(brand.image){
                await fs.unlink(brand.image)
            }
            brand.image = data.image
        }
       await brand.save()
       return {data:brand}
    }
    async getBrand(id: Types.ObjectId) {
        const brand = await this.brandRepo.findOne({
            filter: {
                _id: id
            }
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        return { data: brand }
    }
    async getBrands() {
        const brands = await this.brandRepo.find({filter:{}});
        return { data: brands }
    }
}
