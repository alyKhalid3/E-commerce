import { HydratedDocument, Types } from "mongoose";





export interface ICategory {

    name: string;
    slug: string
    createdBy: string
    image: string
    brands:Array<Types.ObjectId>

}

export type IHydratedCategory = HydratedDocument<ICategory>