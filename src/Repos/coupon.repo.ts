
import { DBRepo } from "./DBRepo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ICoupon } from "src/types/coupon.type";
import { Coupon } from "src/models/coupon.model";





export class CouponRepo extends DBRepo<ICoupon>{
    constructor( @InjectModel(Coupon.name) protected override readonly model: Model<ICoupon>) { super(model); }
}