import { Type } from "class-transformer";
import { IsInt } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination.query.dto";

export class OrderPaginationQueryDto extends PaginationQueryDto {
    @Type(() => Number)
    @IsInt()
    userId: number
}