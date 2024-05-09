import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ChatModule } from './chat/chat.module';
// import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
import { JwtService } from '@nestjs/jwt';
import { SpecialProductModule } from './special-product/special-product.module';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploaded-files'),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      context:
        //  ({ req }) => ({ req }),
        ({ req }) => {
          const token = req.headers.authorization?.split(' ')[1];
          if (token) {
            try {
              const jwtService = new JwtService({ secret: 'JWT_SECRET' }); // Ensure this is your JWT secret
              const user = jwtService.decode(token);
              req.user = user; // Store the user in the request context
            } catch (e) {
              console.error('JWT Decoding Error:', e);
            }
          }
          return { req };
        },
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
    SpecialProductModule,
    // ChatModule,

    // EventsModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: 'Upload',
    //   useValue: GraphQLUpload,
    // },
  ],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // Apply the upload middleware
//     consumer
//       .apply(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }))
//       .forRoutes('/graphql');
//   }
// }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
