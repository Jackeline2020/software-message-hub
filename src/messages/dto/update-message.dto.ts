import { IsEnum, IsNotEmpty } from 'class-validator';

export enum MessageStatus {
    ENVIADO = 'enviado',
    RECEBIDO = 'recebido',
    LIDO = 'lido'
}

export class UpdateMessageDto {
    @IsEnum(MessageStatus)
    @IsNotEmpty()
    status: MessageStatus;
}