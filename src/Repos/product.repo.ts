import { IProduct } from "src/types/product.type";
import { DBRepo } from "./DBRepo";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "src/models/product.model";
import { Model } from "mongoose";








export class ProductRepo extends DBRepo<IProduct> {
    constructor(@InjectModel(Product.name) protected override readonly model: Model<IProduct>) { super(model); }
}