import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    async create(@Body() dto: CreateMessageDto) {
        return await this.messagesService.create(dto);
    }

    @Get('by-sender')
    async findBySender(@Query('sender') sender: string) {
        return await this.messagesService.findBySender(sender);
    }

    @Get('by-period')
    async findByPeriod(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        return await this.messagesService.findByPeriod(startDate, endDate);
    }

    @Get('by-id/:id')
    async findById(@Param('id') id: string) {
        return await this.messagesService.findById(id);
    }

    @Patch(':id/status')
    async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
        return await this.messagesService.update(id, updateMessageDto);
    }
}
