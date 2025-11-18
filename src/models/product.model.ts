import { Category } from './category.model';
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { User } from "./user.model";
import slugify from "slugify";
import { IHydratedBrand } from "src/types/brand.type.";
import { Brand } from './brand.model';
import { IProduct } from 'src/types/product.type';




@Schema({
    timestamps: true
})
export class Product implements IProduct {
    @Prop({
        type: String,
        required: true,

    })
    name: string;

    @Prop({
        type: String,
    })
    slug: string
    @Prop({
        type: String,
        required: true,

    })
    description: string;
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User.name
    })
    createdBy: string
    @Prop({
        type: [String],
        required: true
    })
    images: string[]
    @Prop({
        type: Number,
        required: true
    })
    originalPrice: number
    @Prop({
        type: Number,
        default: 0
    })
    discount: number

    @Prop({
        type: Number,
        required: true
    })
    salePrice: number

    @Prop({
        type: Number,
        required: true,
        default: 0
    })
    stock: number

    @Prop({
        type: Number,
        default: 0
    })
    soldItems: number

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Category.name
    })
    category: Types.ObjectId
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Brand.name
    })
    brand: Types.ObjectId


}


const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (this: IHydratedBrand, next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})
const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
export { ProductModel };