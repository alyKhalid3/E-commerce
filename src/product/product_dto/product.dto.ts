
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'


// export class CreateProductDto {
//     @IsString()
//     @IsNotEmpty()
//     name: string

//     @IsString()
//     @IsOptional()
//     description: string

//     @IsString()
//     @IsNotEmpty()
//     images: string[]

//     @IsNumber()
//     @Type(() => Number)
//     originalPrice: number

//     @IsNumber()
//     @Type(() => Number)
//     discount: number


//     @IsNumber()
//     @Type(() => Number)
//     stock: number

//     @IsMongoId()
//     category: Types.ObjectId


//     @IsMongoId()
//     brand: Types.ObjectId
// }



// export type CreateProductDto = z.infer<typeof createProductSchema>