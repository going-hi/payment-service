import { IsInt, IsNumber } from 'class-validator';

export class OrderItemDto {
    @IsInt()
    quantity: number;

    @IsNumber()
    price: number;

    @IsInt()
    productId: number;
}
