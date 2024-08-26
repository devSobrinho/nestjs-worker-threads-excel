import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrintController } from './print/print.controller';
import { PrintService } from './print/print.service';

@Module({
  imports: [],
  controllers: [AppController, PrintController],
  providers: [AppService, PrintService],
})
export class AppModule {}
