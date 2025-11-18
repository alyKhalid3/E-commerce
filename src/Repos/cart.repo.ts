import { ICart } from "src/types/cart.type";
import { DBRepo } from "./DBRepo";
import { InjectModel } from "@nestjs/mongoose";
import { Cart } from "src/models/cart.model";
import { Model } from "mongoose";







export class CartRepo extends DBRepo<ICart>{
    constructor( @InjectModel(Cart.name) protected override readonly model: Model<ICart>) { super(model); }
}