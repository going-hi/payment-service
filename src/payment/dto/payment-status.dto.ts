class AmountPayment {
    value: string
    currency: string
}


class ObjectPayment {
    id: string
    status: string
    // при успешном возврате
    payment_id?: string
    
    amount: AmountPayment
    description: string
    payment_method: {
        type: string
        id: number
        saved: boolean
        title: string
        card: object
    }
    created_at: string
    expires_at: string
}

export class PaymentStatusDto {
    event: 
        | 'payment.succeeded'
        | 'payment.waiting_for_capture'
        | 'payment.canceled'
        | 'refund.succeeded'

    type: string
    object: ObjectPayment
}

