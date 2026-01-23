import { Types } from "mongoose";





export class ICoupon{
    code: String;
    discount: number;
    expiresAt: Date;
    createdBy: Types.ObjectId
}

