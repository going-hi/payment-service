import { IsInt } from 'class-validator';

export class RefundDto {
    @IsInt()
    orderId: number;
}
