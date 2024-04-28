import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { EventsModule } from './events/events.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
     
      context: ({ req }) => ({ req }),
     
      
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ProductModule,
    UserModule,
    AuthModule,
    CategoryModule,
    OrderModule,
    ChatModule,

    EventsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
