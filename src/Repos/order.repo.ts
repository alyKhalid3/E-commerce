import { IOrder } from "src/types/order.type";
import { DBRepo } from "./DBRepo";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "src/models/order.model";
import { Model } from "mongoose";






export class OrderRepo extends DBRepo<IOrder>{
    constructor(@InjectModel(Order.name) protected override readonly model: Model<IOrder>) { super(model) }
}