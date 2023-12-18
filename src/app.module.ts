import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigOptions } from './configs/env.config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { FileModule } from './file/file.module';
import { PaymentModule } from './payment/payment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot(EnvConfigOptions),
        ProductModule,
        OrderModule,
        FileModule,
        PaymentModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../static')
        })
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
