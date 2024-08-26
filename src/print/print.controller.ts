import { Controller, Get, Query, Res } from '@nestjs/common';
import { PrintService } from './print.service';
import { Response } from 'express';

@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @Get('excel')
  excel(@Query('qtd') qtd: string, @Res() res: Response) {
    res.setHeader('Content-Disposition', `attachment; filename=Jurandir.xlsx`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    return this.printService.excel(+qtd, res);
  }

  @Get('pdf')
  pdf() {
    return this.printService.pdf();
  }
}
