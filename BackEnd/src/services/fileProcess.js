import { createReadStream } from 'node:fs';
import { Readable, Transform } from 'node:stream';
import csvtojson from 'csvtojson';

export function mapData(data) {
  // Função para mapear os dados do CSV para o formato desejado
  return {
    title: data.title,
    description: data.description,
    year: data.year,
    type: data.type,
    rate_start: data.rate_start,
    votes: data.votes,
    status: data.status,
    followers: data.followers,
    episodes: data.episodes,
    genders: data.genders,
    url_anime: data.url_anime,
    image: data.image
  };
}

export async function processFile(file) {
  // Função para processar os dados do CSV
  const stream = createReadStream(file);

  return Readable.toWeb(stream)
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        const data = JSON.parse(Buffer.from(chunk));
        const mappedData = mapData(data);

        controller.enqueue(JSON.stringify(mappedData).concat('\n'));
      }
    }));
}
