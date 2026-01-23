import { Types } from "mongoose";





export class ICart {
    user: Types.ObjectId;
    items: {
        product: Types.ObjectId,
        quantity: number,
        price: number,
        total: number

    }[];
    totalPrice: number

    coupon?: Types.ObjectId | null

    discount?: number

    totalAfterDiscount?: number

}