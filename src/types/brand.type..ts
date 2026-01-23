import { HydratedDocument, Types } from "mongoose";





export interface IBrand {

    name: string;
    slug: string
    createdBy: Types.ObjectId
    image: string


}

export type IHydratedBrand= HydratedDocument<IBrand>