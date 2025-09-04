import { NestFactory } from '@nestjs/core';
import tracer from 'dd-trace';
import 'dotenv/config';
import { AppModule } from './app.module';
import { logger } from './logger/winston.logger';

tracer.init({
  service: 'message-hub',
  env: process.env.NODE_ENV,
  logInjection: true
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useLogger({
    log: (message: any) => logger.info(message),
    error: (message: any, trace: string) => logger.error(`${message} - ${trace}`),
    warn: (message: any) => logger.warn(message),
    debug: (message: any) => logger.debug(message),
    verbose: (message: any) => logger.verbose(message),
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.info('Message Hub Started');
}
bootstrap();