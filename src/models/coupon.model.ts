import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { ICart } from "src/types/cart.type";
import { User } from "./user.model";
import { Product } from "./product.model";
import { ICoupon } from "src/types/coupon.type";







@Schema({
    timestamps: true
})
export class Coupon implements ICoupon {

    @Prop({
        type:String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        ref: User.name
    })
    code: String;

    @Prop({
        type: Number,
        required: true,
        min: 1,
        max: 100

    })
    discount: number

    @Prop({
        type: Date,
        required: true
    })
    expiresAt: Date;
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User.name
    })
    createdBy: Types.ObjectId;
}



const CouponSchema = SchemaFactory.createForClass(Coupon);
export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])
