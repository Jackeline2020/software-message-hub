import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { logger } from './../logger/winston.logger';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ValidationStrategy } from './strategies/validation.strategy';

@Injectable()
export class MessagesService {
    constructor(
        @Inject('MESSAGEE_MODEL') private readonly _messageModel: Model<any>,
        private readonly _validationStrategy: ValidationStrategy
    ) { }

    async create(dto: CreateMessageDto) {
        try {
            const body = await this._messageModel.create({
                content: dto.content,
                sender: dto.sender
            });

            logger.info(`Enviando mensagem para: ${body.sender}`);
            return {
                ...await body,
                createdAt: this._validationStrategy.formatDate(body.createdAt),
            }

        } catch (err) {
            logger.error('Error ao enviar mensagem:', err);
            throw new InternalServerErrorException(`Error ao enviar mensagem: ${err}`);
        }
    }

    async findById(id: string) {
        try {
            logger.info(`Buscando mensagem por id: ${id}`);
            const body = await this._messageModel.get({ id: id });

            return {
                ...await body,
                createdAt: this._validationStrategy.formatDate(body.createdAt),
            }

        } catch (err) {
            logger.error('Error ao buscar mensagem por id:', err);
            throw new InternalServerErrorException(`Error ao buscar mensagem por id: ${err}`);
        }
    }

    async findBySender(sender: string) {
        try {
            logger.info(`Buscando mensagem por remetente: ${sender}`);
            const results = await this._messageModel
                .query('sender')
                .using('sender-index')
                .eq(sender)
                .exec();

            return results.toJSON().map(result => ({
                ...result,
                createdAt: this._validationStrategy.formatDate(result.createdAt)
            }));

        } catch (err) {
            logger.error('Error ao buscar mensagem por remetente:', err);
            throw new InternalServerErrorException(`Error ao buscar mensagem por remetente: ${err}`);
        }
    }

    async findByPeriod(startDate: string, endDate: string) {
        try {
            const start = this._validationStrategy.formatToYYYYMMDD(new Date(startDate));
            const end = this._validationStrategy.formatToYYYYMMDD(new Date(endDate));

            logger.info(`Buscando mensagem por data inicial: ${startDate} e data final: ${endDate}`);
            const messages = await this._messageModel
                .query('status')
                .eq('enviado')
                .where('createdAt')
                .between(start, end)
                .using('status-createdAt-index')
                .exec();

            return messages.toJSON().map(message => ({
                ...message,
                createdAt: this._validationStrategy.formatDate(message.createdAt)
            }));

        } catch (err) {
            logger.error('Error ao buscar mensagem por periodo:', err);
            throw new InternalServerErrorException(`Error ao buscar mensagem por periodo: ${err}`);
        }
    }

    async update(id: string, dto: UpdateMessageDto) {
        try {
            const body = await this._messageModel.update(id, { status: dto.status, });
            logger.info(`Atualizando status da mensagem para: ${body.status}`);

            return {
                ...await body,
                createdAt: this._validationStrategy.formatDate(body.createdAt),
            }

        } catch (err) {
            logger.error('Error ao atualizar status da mensagem:', err);
            throw new InternalServerErrorException(`Error ao atualizar status da mensagem: ${err}`);
        }
    }
}