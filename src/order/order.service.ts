import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { PrismaService } from 'src/common/prisma.service';
import { PaymentStatusDto } from '../payment/dto/payment-status.dto';
import { EnumOrderStatus } from './order-status.enum';
import { PaymentService } from 'src/payment/payment.service';
import { RefundDto } from './dto/refund.dto';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private readonly paymentService: PaymentService
    ) {}

    async placeOrder(dto: OrderDto, userId: number) {
        const total = dto.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const order = await this.prisma.order.create({
            data: {
                status: dto.status,
                totalPrice: total,
                user: {
                    connect: {
                        id: userId
                    }
                },
                items: {
                    create: dto.items
                }
            }
        });
        const payment = await this.paymentService.createPayment(order);
        await this.prisma.order.update({
            where: { id: order.id },
            data: { order_payment_id: payment.id }
        });
        return payment;
    }

    async updateStatus(dto: PaymentStatusDto) {
        console.log(dto.event, 'event');

        if (dto.event === 'payment.waiting_for_capture')
            return await this.eventWaitingForCapture(dto.object.id);
        if (dto.event === 'payment.succeeded') {
            const orderId = Number(dto.object.description.split('#')[1]);
            return await this.eventPaymentSucceeded(orderId);
        }
        if (dto.event === 'refund.succeeded')
            return this.eventRefundSucceeded(dto.object.payment_id);
        if (dto.event === 'payment.canceled') return this.eventPaymentCanceled(dto);
    }

    async refund(dto: RefundDto) {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId }
        });
        if (!order) throw new NotFoundException();
        if (order.status !== EnumOrderStatus.PAYED) throw new BadRequestException();
        const payment = await this.paymentService.createRefund(
            order.order_payment_id,
            order.totalPrice
        );
        return payment;
    }

    async findAll(count: number, page: number, userId: number) {
        const where = {
            user: {
                id: userId
            }
        };

        const [orders, totalCount] = await Promise.all([
            this.prisma.order.findMany({
                where,
                take: count,
                skip: page * count - count,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            }),
            this.prisma.order.count({ where })
        ]);
        return { orders, count: totalCount };
    }

    private async eventWaitingForCapture(id: string) {
        const payment = await this.paymentService.capturePayment(id);
        return payment;
    }

    private async eventPaymentSucceeded(orderId: number) {
        const order = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: EnumOrderStatus.PAYED
            }
        });
        return order;
    }

    private async eventRefundSucceeded(paymentId: string) {
        const order = await this.prisma.order.update({
            where: { order_payment_id: paymentId },
            data: { status: EnumOrderStatus.REFUND }
        });
        return order;
    }

    private eventPaymentCanceled(dto: PaymentStatusDto) {
        console.log(dto, 'event cancel ');
    }
}
