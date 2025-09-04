import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    MessagesModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }