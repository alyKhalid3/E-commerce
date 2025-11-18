import { HydratedDocument, Types } from "mongoose"






export interface IOrder {

    user: Types.ObjectId
    items: {
        product: Types.ObjectId,
        quantity: number
    }[],
    subtotal: number
    discount: number
    total: number
    address: string
    instructions: string[]
    phone: string
    paymentMethod: PaymentMethodEnum
    orderStatus: OrderStatusEnum

}

export type IHydratedOrder=HydratedDocument<IOrder>

export enum PaymentMethodEnum{
    CASH = 'cash',
    CARD = 'card'
}

export enum OrderStatusEnum{
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}