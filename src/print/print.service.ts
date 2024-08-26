import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { WorkerPoolService } from './ worker-pool.service';

const worker = new WorkerPoolService();

@Injectable()
export class PrintService {
  async excel(qtd: number, res: Response) {
    worker.addTask(qtd, res);
  }
  pdf() {
    return 'This action returns all pdf';
  }
}
