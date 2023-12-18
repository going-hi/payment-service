import { ArrayMinSize, IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { EnumOrderStatus } from "../order-status.enum";
import { OrderItemDto } from "./order-item.dto";
import { Type } from "class-transformer";

export class OrderDto {
    @IsOptional()
    @IsEnum(EnumOrderStatus)
    status: EnumOrderStatus

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => OrderItemDto)
    @ArrayMinSize(1)
    items: OrderItemDto[]
}
