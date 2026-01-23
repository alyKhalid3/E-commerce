
import { CategoryRepo } from '../../Repos/category.repo';
import { UserRepo } from '../../Repos/user.repo';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BrandRepo } from 'src/Repos/brand.repo';
import { ProductRepo } from 'src/Repos/product.repo';
import { IProduct } from 'src/types/product.type';

@Injectable()
export class ProductService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly productRepo: ProductRepo,
    private readonly CategoryRepo: CategoryRepo,
    private readonly brandRepo: BrandRepo

  ) { }
  async create(data: IProduct) {
    const brand = await this.brandRepo.findOne({
      filter: {
        _id: data.brand
      }
    })
    if (!brand) {
      throw new BadRequestException("Brand not found")
    }
    const category = await this.CategoryRepo.findOne({
      filter: {
        _id: data.category
      }
    })
    if (!category) {
      throw new BadRequestException("Category not found")
    }
    data.salePrice = data.originalPrice - (data.discount / 100) * data.originalPrice
    return await this.productRepo.create(data)
  }
  async updateProduct(id: Types.ObjectId, data: IProduct) {
    const product = await this.productRepo.findOne({
      filter: {
        _id: id,
        createdBy: data.createdBy
      },
    })
    if (!product) {
      throw new BadRequestException("Product not found")
    }
    const category=await this.CategoryRepo.findOne({
      filter:{
        _id:data.category
      }
    })
    if(data.category && !category){
      throw new BadRequestException("Category not found")
    }
    const brand=await this.brandRepo.findOne({
      filter:{
        _id:data.brand
      }
    })
    if(data.brand && !brand){
      throw new BadRequestException("Brand not found")
    }
    data.salePrice = data.originalPrice - (data.discount / 100) * data.originalPrice

    await product.updateOne(data)
    return 'Product updated successfully'
  }

  async getAllProducts() {
    return this.productRepo.find({
      filter: {}, options: {
        populate: ['category', 'brand']
      }
    });
  }

}
