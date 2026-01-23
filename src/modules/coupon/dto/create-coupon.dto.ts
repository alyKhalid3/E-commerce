import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsUppercase, Max, Min } from "class-validator";

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    code: string;
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    discount: number;
    @IsNotEmpty()
    expiresAt: Date;
}


