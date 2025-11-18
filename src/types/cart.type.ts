import { Types } from "mongoose";





export class ICart{
    user: Types.ObjectId;
    items: {
        product: Types.ObjectId,
        quantity: number
    }[];
}