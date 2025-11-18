import { HydratedDocument } from "mongoose";





export interface IBrand {

    name: string;
    slug: string
    createdBy: string
    image: string


}

export type IHydratedBrand= HydratedDocument<IBrand>