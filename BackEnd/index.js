import { createServerAndHandleRequests } from './src/server/server.js';

// Executar a função principal
createServerAndHandleRequests();

//createReadStream('animeflv.csv').pipe(response)
//curl -I  -X OPTIONS -N localhost:3000
//HTTP/1.1 204 No Content
//access - control - allow - origin: *
//access - control - allow - method: *
//Date: Sat, 11 Nov 2023 14: 29:01 GMT
//Connection: keep - alive
//Keep - Alive: timeout = 5
//curl -N localhost:3000