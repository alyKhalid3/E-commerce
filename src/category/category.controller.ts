import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';
import type { ICategory } from 'src/types/category.type';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }





    @Post('create')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: multerOptions("uploads/categories")
    }))
    async createCategory( @Req() req: AuthRequest, @Body() data: ICategory,@UploadedFile() image: Express.Multer.File) {
        data.image = image.path
        data.createdBy = req.user.id
        return { data: await this.categoryService.create(data) }
    }
    @Patch('update/:categoryId')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: multerOptions("uploads/categories")
    }))
    async updateCategory(

        @Req() req: AuthRequest,
        @Body() data: ICategory,
        @Param('categoryId') categoryId: Types.ObjectId,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image)
            data.image = image.path
        data.createdBy = req.user.id
        return { data: await this.categoryService.update(categoryId, data) }
    }


    @Get('all')
    async findAll() {
        return { data: await this.categoryService.findAll() }
    }


}
