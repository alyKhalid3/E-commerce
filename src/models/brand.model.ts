import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { User } from "./user.model";
import slugify from "slugify";
import { IBrand, IHydratedBrand } from "src/types/brand.type.";






@Schema({
    timestamps: true
})
export class Brand implements IBrand {
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
    createdBy: Types.ObjectId
    @Prop({
        type: String,
        required: true
    })
    image: string


}


const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre('save',  function (this: IHydratedBrand, next) {
    this.slug= slugify(this.name,{lower:true})
    next()
})
const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])
export { BrandModel };