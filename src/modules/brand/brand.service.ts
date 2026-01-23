
import { ProductRepo } from 'src/Repos/product.repo';
import { Types } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepo } from 'src/Repos/brand.repo';
import { IBrand } from 'src/types/brand.type.';
import fs from 'fs/promises'
import { IHydratedUser, IUser } from 'src/types/user.type';
import { UserRepo } from 'src/Repos/user.repo';
import { deleteFile, deleteFiles } from 'src/common/utils/multer';
import { CartRepo } from 'src/Repos/cart.repo';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepo: BrandRepo,
        private readonly productRepo: ProductRepo,
        private readonly userRepo: UserRepo,
        private readonly cartRepo: CartRepo
    ) { }
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
            filter: {
                _id: brandId,
                createdBy: data.createdBy
            }
        });
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        if (data.name) {
            brand.name = data.name
        }
        if (data.image) {
            if (brand.image) {
                await fs.unlink(brand.image)
            }
            brand.image = data.image
        }
        await brand.save()
        return { data: brand }
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
        const brands = await this.brandRepo.find({ filter: {} });
        return { data: brands }
    }
    async deleteBrand(id: Types.ObjectId, user: IHydratedUser) {

        const brand = await this.brandRepo.findOne({
            filter: {
                _id: id
            }
        })
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        if (user.role !== "admin" && !brand.createdBy.equals(user._id)) {
            console.log(typeof brand.createdBy, typeof user._id);

            throw new BadRequestException("You are not authorized to delete this brand");
        }


        const products = await this.productRepo.find({
            filter: {
                brand: id
            }
        })
        if (products.length > 0) {
            products.forEach(async (product) => {
                deleteFiles(product.images)
                await product.deleteOne()
            })
        }
        const cart = await this.cartRepo.findOne({
            filter: {
                _id: user._id
            }
        })
        if (cart && cart.items.length > 0) {
            cart.items.forEach(async (item) => {
                if (item.product.equals(id)) {
                    await cart.deleteOne()
                }
            })
        }
        deleteFile(brand.image)
        await brand.deleteOne()
        await user.save()
        return { message: "Brand and its products deleted successfully" }

    }
}
