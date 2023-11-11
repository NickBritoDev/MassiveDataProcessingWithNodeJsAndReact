import { createServer } from 'node:http';
import { WritableStream } from 'node:stream/web';
import { setTimeout } from 'node:timers/promises';
import { processFile } from '../services/fileProcess.js';

const PORT = 3000;

export function createServerAndHandleRequests() {
  // Função para criar o servidor e lidar com as requisições
  createServer(async (request, response) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    };

    if (request.method === 'OPTIONS') {
      response.writeHead(204, headers);
      response.end();
      return;
    }

    request.once('close', _ => console.log('Connection was closed', items));

    let items = 0;

    const file = './src/upload/animeflv.csv'
    const csvStream = await processFile(file);

    csvStream
      .pipeTo(new WritableStream({
        async write(chunk) {
          await setTimeout(1000);
          items++;
          response.write(chunk);
        },
        close() {
          response.end();
        }
      }));

    response.writeHead(200, headers);
  })
    .listen(PORT)
    .on('listening', __ => console.log(`Server is running at ${PORT}`));
}
