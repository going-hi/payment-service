import { Transform, Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"

export class CreateProductDto {
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description?: string

    @Type(() => Number)
    @IsInt()
    price: number
}
