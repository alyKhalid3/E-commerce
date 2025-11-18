

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepo } from 'src/Repos/category.repo';
import { ICategory } from 'src/types/category.type';
import { BrandRepo } from 'src/Repos/brand.repo';
import { Types } from 'mongoose';
import fs from 'fs/promises'

@Injectable()
export class CategoryService {

    constructor(
        private readonly categoryRepo: CategoryRepo,
        private readonly brandRepo: BrandRepo,

    ) { }

    async create(data: ICategory) {
        const isExist = await this.categoryRepo.findOne({
            filter: {
                name: data.name
            }
        });
        if (isExist) {
            throw new BadRequestException("Category already exists");
        }
        if (data.brands.length && data.brands) {
            const foundBrands = await this.brandRepo.find({
                filter: {
                    _id: {
                        $in: data.brands
                    }
                }
            });
            if (foundBrands.length !== data.brands.length) {
                throw new BadRequestException("some Brands not found");
            }

        }
        return await this.categoryRepo.create(data)
    }
    async update(categoryId: Types.ObjectId, data: ICategory) {
        const category = await this.categoryRepo.findOne({
            filter: {
                _id: categoryId,
                createdBy: data.createdBy
            }
        });
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        if (data.brands?.length > 0 && data.brands) {
            const foundBrands = await this.brandRepo.find({
                filter: {
                    _id: {
                        $in: data.brands
                    }
                }
            });
            if (foundBrands.length !== data.brands.length) {
                throw new BadRequestException("some Brands not found");
            }

        }
        if (data.brands) {
            category.brands = data.brands
        }
        if (data.name) {
            category.name = data.name
        }
        if (data.image) {
            if (category.image) {
                await fs.unlink(category.image)
            }
            category.image = data.image
        }
        await category.save()
        return category
    }

    async findAll() {
        const categories = await this.categoryRepo.find({ filter: {},options:{populate:[{
            path:"brands",
            select:"name"
        }]} });
        return { data: categories }
    }
}
