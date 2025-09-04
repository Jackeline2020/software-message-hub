import { Provider } from '@nestjs/common';
import * as dynamoose from 'dynamoose';

export function createDynamooseProvider(table: string, schema: any): Provider {
    return {
        provide: `${table.toUpperCase()}_MODEL`,
        useFactory: () => {
            return dynamoose.model(table, schema, {
                create: true,
                waitForActive: true,
            });
        }
    }
}