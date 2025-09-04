import { Schema } from "dynamoose";
import { v4 as uuid } from 'uuid';

export enum MessageStatus {
  ENVIADO = 'enviado',
  RECEBIDO = 'recebido',
  LIDO = 'lido'
}

export const MessageSchema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
    default: uuid
  },
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true,
    index: {
      name: 'sender-index',
      type: 'global'
    }
  },
  createdAt: {
    type: Number,
    required: true,
    default: () => {
      const now = new Date();
      return now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
    }
  },
  status: {
    type: String,
    enum: Object.values(MessageStatus),
    default: MessageStatus.ENVIADO,
    required: true,
    index: {
      name: 'status-createdAt-index',
      type: 'global',
      rangeKey: 'createdAt'
    }
  },
});