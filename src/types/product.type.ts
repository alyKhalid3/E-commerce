import { HydratedDocument, Types } from "mongoose";








export interface IProduct {

    name: string;
    slug: string
    description: string;
    createdBy: string
    images: string[]
    originalPrice: number
    discount: number
    salePrice: number
    stock: number
    soldItems: number
    category: Types.ObjectId
    brand: Types.ObjectId


}


export type IHydratedProduct = HydratedDocument<IProduct>
