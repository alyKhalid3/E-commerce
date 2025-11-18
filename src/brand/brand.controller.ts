

import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { IBrand } from 'src/types/brand.type.';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';
import { Types } from 'mongoose';
import { multerOptions } from 'src/common/utils/multer';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }






    @Post('create')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: multerOptions('./src/uploads/brands')
    }))
    async create(@Req() req: AuthRequest, @Body() data: IBrand, @UploadedFile() image: Express.Multer.File,) {
        data.image = image.path
        data.createdBy = req.user.id
        return { data: await this.brandService.create(data) }
    }


    @Patch('update/:brandId')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: multerOptions('uploads/brands')
    }))
    async updateBrand(
        @Req() req: AuthRequest,
        @Param('brandId') brandId: Types.ObjectId,
        @Body() data: IBrand,
        @UploadedFile() image: Express.Multer.File

    ) {
        data.image = image.path
        data.createdBy = req.user.id
        return await this.brandService.updateBrand(brandId, data)
    }

    @Get('get{/:id}')
    async getBrands(@Param('id') id: Types.ObjectId) {
        if (id) return await this.brandService.getBrand(id)
        return await this.brandService.getBrands()

    }
}



