import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
  ConfigModule.forRoot({ envFilePath: 'config/.env' }),
  AuthModule,
  MongooseModule.forRoot(process.env.MONGO_URI as string, {
    onConnectionCreate: (connection) => {
      connection.on('connected', () => console.log('connected'));
      connection.on('open', () => console.log('open'));
      connection.on('disconnected', () => console.log('disconnected'));
      connection.on('reconnected', () => console.log('reconnected'));
      connection.on('disconnecting', () => console.log('disconnecting'));
    }
  }),
  BrandModule,
  CategoryModule,
  ProductModule,
  CartModule,
  OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
  }
 }
