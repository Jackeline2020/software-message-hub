import { DynamicModule, Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dynamoose from 'dynamoose';
import { createDynamooseProvider } from './database.providers';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    dynamoose.aws.ddb.local(process.env.DYNAMODB_ENDPOINT);

    return { module: DatabaseModule }
  }

  static forFeature(models: { table: string; schema: any }[]): DynamicModule {
    const providers = models.map(model => createDynamooseProvider(model.table, model.schema));
    return {
      module: DatabaseModule,
      providers,
      exports: providers
    };
  }
}