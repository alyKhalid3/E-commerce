import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { ICart } from "src/types/cart.type";
import { User } from "./user.model";
import { Product } from "./product.model";







@Schema({
    timestamps: true
})
export class Cart implements ICart {
    
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: User.name
    })
    user: Types.ObjectId;
    
    @Prop({
        type:[{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: Product.name
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            }
        }],
        default: []

    })
    items: { product: Types.ObjectId; quantity: number; }[];
}



const CartSchema = SchemaFactory.createForClass(Cart);
export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
