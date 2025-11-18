import { ICategory } from "src/types/category.type";
import { DBRepo } from "./DBRepo";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "src/models/category.model";
import { Model } from "mongoose";





export class CategoryRepo extends DBRepo<ICategory>{
    constructor( @InjectModel(Category.name) protected override readonly model: Model<ICategory>) { super(model); }
}