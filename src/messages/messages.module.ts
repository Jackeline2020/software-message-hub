import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MessageSchema } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ValidationStrategy } from './strategies/validation.strategy';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { table: 'Messagee', schema: MessageSchema }
    ])
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ValidationStrategy]
})
export class MessagesModule { }