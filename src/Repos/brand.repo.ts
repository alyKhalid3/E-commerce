import { IBrand } from "src/types/brand.type.";
import { DBRepo } from "./DBRepo";
import { InjectModel } from "@nestjs/mongoose";
import { Brand } from "src/models/brand.model";
import { Model } from "mongoose";





export class BrandRepo extends DBRepo<IBrand>{
    constructor( @InjectModel(Brand.name) protected override readonly model: Model<IBrand>) { super(model); }
}