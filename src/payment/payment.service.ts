import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as Yookassa from 'yookassa'

@Injectable()
export class PaymentService {
    private yooKassa: Yookassa
    constructor(
        private readonly configService: ConfigService
    ) {
        this.yooKassa = new Yookassa({
            shopId: configService.get("U_KASSA_SHOP_ID"),
            secretKey: configService.get("U_KASSA_TOKEN")
        })
    }

    async createPayment(order: Order) {
        const payment = await this.yooKassa.createPayment({
            amount: {
                value: order.totalPrice.toFixed(2),
                currency: "RUB"
              },
              payment_method_data: {
                  type: "bank_card"
              },
              confirmation: {
                type: "redirect",
                return_url: "http://localhost:3000/thanks"
              },
              description: `Order #${order.id}`,
              test: true
        })
        return payment
    }

    async capturePayment(id: string) {
        return await this.yooKassa.capturePayment(id)
    }
    
    async createRefund(id: string, price: number) {
        const payment = await this.yooKassa.createRefund(id, {
            value: price.toFixed(2),
            currency: "RUB" 
        })
        return payment
    }

    async cancel(id: string) {
        const payment = await this.yooKassa.cancelPayment(id)
        return payment
    }
    
}
