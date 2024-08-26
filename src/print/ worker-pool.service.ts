import { Worker } from 'worker_threads';
import * as path from 'path';
import { EventEmitter } from 'events';
import { Response } from 'express';

interface Task {
  qtd: number;
  res: Response;
}

export class WorkerPoolService {
  private maxThreads = 1; // Define o número máximo de threads
  private taskQueue: Task[] = [];
  private activeWorkers = 0;
  private eventEmitter = new EventEmitter();

  constructor() {
    this.eventEmitter.on('workerAvailable', () => {
      this.processNextTask();
    });
  }

  private processNextTask() {
    if (this.activeWorkers < this.maxThreads && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        this.executeTask(task);
      }
    }
  }

  private executeTask({ qtd, res }: Task) {
    this.activeWorkers++;
    const worker = new Worker(path.join(__dirname, 'print-excel.worker.js'), {
      workerData: { qtd },
    });

    worker.on('message', (data) => {
      if (data.msg === 'done') {
        this.activeWorkers--;
        res.end();
        this.eventEmitter.emit('workerAvailable');
      } else if (data.msg === 'chunk') {
        res.write(data.chunk);
      }
    });

    worker.on('error', (error) => {
      this.activeWorkers--;
      console.error('Worker error:', error);
      res.status(500).send('Erro ao gerar o arquivo Excel');
      this.eventEmitter.emit('workerAvailable');
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        this.activeWorkers--;
        console.error(`Worker stopped with exit code ${code}`);
        res.status(500).send('Erro ao gerar o arquivo Excel');
        this.eventEmitter.emit('workerAvailable');
      }
    });
  }

  public addTask(qtd: number, res: Response) {
    this.taskQueue.push({ qtd, res });
    this.processNextTask();
  }
}
