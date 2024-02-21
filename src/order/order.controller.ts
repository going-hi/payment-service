import {
    Controller,
    Get,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    HttpCode,
    Query,
    HttpStatus
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from '../payment/dto/payment-status.dto';
import { OrderPaginationQueryDto } from './dto/order.query.dto';
import { RefundDto } from './dto/refund.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @HttpCode(HttpStatus.OK)
    @Post()
    placeOrder(@Body() dto: OrderDto) {
        return this.orderService.placeOrder(dto, 987);
    }

    @HttpCode(HttpStatus.OK)
    @Post('status')
    updateStatus(@Body() dto: PaymentStatusDto) {
        return this.orderService.updateStatus(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Get('thanks')
    thanks() {
        return 'thanks for order';
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    findAll(@Query() { count, page, userId }: OrderPaginationQueryDto) {
        return this.orderService.findAll(count, page, userId);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refund')
    refund(@Body() dto: RefundDto) {
        return this.orderService.refund(dto);
    }
}
