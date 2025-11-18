import { map } from 'rxjs';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Req, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import type { IProduct } from 'src/types/product.type';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';
import { createProductSchema } from './product_validation/product.zod';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: multerOptions('uploads/products')
  }))
  // @UsePipes(new ZodValidationPipe(createProductSchema))
 async create( @Body() data: IProduct, @Req() req: AuthRequest,@UploadedFiles() images) {
    data.images = images.map((image) => image.path);
    data.createdBy = req.user.id
    return { data: await this.productService.create(data) }
  }
  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: multerOptions('uploads/products')
  }))
  async updateProduct(
    @Body() data: IProduct,
   @Req() req: AuthRequest,
   @Param('id') id: Types.ObjectId,
   @UploadedFiles() images: Express.Multer.File[]
  ) {
    data.images = images.map((image) => image.path);
    data.createdBy = req.user.id
    return { data: await this.productService.updateProduct(id, data) }
  }


  @Get('/all')
  async getAllProducts() {
    return { data: await this.productService.getAllProducts() }
  }

}
