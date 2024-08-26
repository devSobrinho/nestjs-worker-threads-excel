import * as ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import { parentPort } from 'worker_threads';

async function executeWorker({ qtd }: { qtd: number }) {
  const stream = new PassThrough();
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream,
  });
  stream.on('data', (data) => {
    parentPort.postMessage({ msg: 'chunk', chunk: data });
  });
  const worksheet = workbook.addWorksheet('Sheet 1');
  for (let index = 0; index < qtd; index++) {
    worksheet
      .addRow(['TEXTO1', 'TEXTO2', 'TEXTO3', 'TEXTO4', 'TEXTO5'])
      .commit();
  }
  worksheet.commit();
  await workbook.commit();

  stream.on('end', () => {
    parentPort.postMessage({ msg: 'done' });
  });
}

export default (
  () => (data) =>
    executeWorker(data)
)();
