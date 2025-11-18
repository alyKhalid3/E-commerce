
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { User } from "./user.model";
import slugify from "slugify";
import { IHydratedBrand } from "src/types/brand.type.";
import { ICategory } from "src/types/category.type";
import { Brand } from "./brand.model";





@Schema({
    timestamps: true
})
export class Category implements ICategory {
    @Prop({
        type: String,
        required: true,
        unique: true
    })
    name: string;

    @Prop({
        type: String,
    })
    slug: string
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User.name
    })
    createdBy: string
    @Prop({
        type: String,
        required: true
    })
    image: string
    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: Brand.name
    })
    brands:Array<Types.ObjectId>

}


const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function (this: IHydratedBrand, next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})
const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
export { CategoryModel };