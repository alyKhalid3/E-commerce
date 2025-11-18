import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { IOrder, OrderStatusEnum, PaymentMethodEnum } from "src/types/order.type";
import { Product } from "./product.model";
import { User } from "./user.model";
import { string } from "zod";






@Schema({ timestamps: true })
export class Order implements IOrder {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User.name
    })
    user: Types.ObjectId;
    @Prop({
        type: [{
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
    @Prop({
        type: Number,
        required: true,
        default: 0
    })
    subtotal: number;
    @Prop({
        type: Number,

        default: 0
    })
    discount: number;
    @Prop({
        type: Number,
        required: true,
        default(): number {
            return this.subtotal
        }
    })
    total: number;
    @Prop({
        type: String,
        required: true
    })
    address: string;
    @Prop({
        type: [string],

    })
    instructions: string[];
    @Prop({
        type: String,
        required: true

    })
    phone: string;
    @Prop({
        type: String,
        required: true,
        enum: Object.values(PaymentMethodEnum),
        default: PaymentMethodEnum.CASH
    })
    paymentMethod: PaymentMethodEnum;
    @Prop({
        type: String,
        enum: Object.values(OrderStatusEnum),
        default: OrderStatusEnum.PENDING
    })
    orderStatus: OrderStatusEnum;

}



const orderSchema=SchemaFactory.createForClass(Order)
export const OrderModel=MongooseModule.forFeature([{name:Order.name,schema:orderSchema}])
