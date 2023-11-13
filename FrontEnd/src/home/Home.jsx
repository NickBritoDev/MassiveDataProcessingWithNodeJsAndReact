import React, { useState, useEffect } from 'react';
import { ChakraProvider, CSSReset, Box, Button, Grid, GridItem, Text, Flex, Image, Divider, Icon } from "@chakra-ui/react";
import { FcLike, FcRating } from 'react-icons/fc';
import SaibaMais from './components/SaibaMais';

const API_URL = 'http://localhost:3000';
let abortController = new AbortController();

export default function Home() {
  // Estado para armazenar os dados obtidos da API
  const [data, setData] = useState([]);
  const [aberto, setAberto] = useState(false)

  // Função assíncrona para consumir a API
  const consumeAPI = async () => {
    // Usa o mesmo sinal para ambas as operações
    const signal = abortController.signal;
    const response = await fetch(API_URL, {
      signal
    });
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(parseNDJSON());

    return reader;
  };


  // Função para analisar dados em formato NDJSON
  const parseNDJSON = () => {
    let ndjsonBuffer = '';
    return new TransformStream({
      transform(chunk, controller) {
        ndjsonBuffer += chunk;
        const items = ndjsonBuffer.split('\n');
        items.slice(0, -1)
          .forEach(item => controller.enqueue(JSON.parse(item)));

        ndjsonBuffer = items[items.length - 1];
      },
      flush(controller) {
        if (!ndjsonBuffer) return;
        controller.enqueue(JSON.parse(ndjsonBuffer));
      }
    });
  };

  // Função para lidar com o botão "Start"
  const handleStart = async () => {
    try {
      // Garante que a operação anterior seja interrompida antes de iniciar uma nova
      await stopAndRestart();
    } catch (error) {
      if (!error.message.includes('abort')) throw error;
    }
  };

  // Função para interromper e reiniciar a operação
  const stopAndRestart = async () => {
    // Limpa os dados antes de iniciar uma nova solicitação
    setData([]);
    // Interrompe a solicitação atual
    abortController.abort();
    // Cria um novo AbortController para solicitações futuras
    abortController = new AbortController();

    const writableStream = appendToHTML();

    const readable = await consumeAPI();
    await readable.pipeTo(writableStream, { signal: abortController.signal });
  };


  // Função para lidar com o botão "Stop"
  const handleStop = () => {
    // Interrompe a busca em andamento
    abortController.abort();
    // Cria um novo AbortController para solicitações futuras
    abortController = new AbortController();
  };

  // Efeito colateral para interromper a operação em andamento ao desmontar o componente
  useEffect(() => {
    return () => {
      // Interrompe qualquer operação em andamento quando o componente é desmontado
      abortController.abort();
    };
  }, []); // A array de dependências vazia significa que este efeito é executado uma vez após a renderização inicial

  const handleSaibaMais = ({
    title,
    description,
    year,
    type,
    rate_start,
    votes,
    status,
    followers,
    episodes,
    genders,
    url_anime,
    image,
  }) => {
    // Render the SaibaMais component with props
    setData((prevData) => [
      ...prevData,
      abrirSaibaMais({
        title,
        description,
        year,
        type,
        rate_start,
        votes,
        status,
        followers,
        episodes,
        genders,
        url_anime,
        image,
      }),
    ]);
  };

  const abrirSaibaMais = ({
    title,
    description,
    year,
    type,
    rate_start,
    votes,
    status,
    followers,
    episodes,
    genders,
    url_anime,
    image,
    aberto,
  }) => {
    return (
      <SaibaMais
        title={title}
        description={description}
        year={year}
        type={type}
        rate_start={rate_start}
        votes={votes}
        status={status}
        followers={followers}
        episodes={episodes}
        genders={genders}
        url_anime={url_anime}
        image={image}
        aberto={aberto}
      />
    );
  };

  // Função para adicionar elementos JSX ao estado 'data'
  const appendToHTML = () => {
    // Captura o valor atual de counter

    return new WritableStream({
      write({
        title,
        description,
        year,
        type,
        rate_start,
        votes,
        status,
        followers,
        episodes,
        genders,
        url_anime,
        image,
      }) {
        const card = (
          <GridItem key={title} borderWidth="1px" borderRadius="lg" p="4">
            <Box display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'space-around'} p={0}>
              <Text fontSize="xl" fontWeight="bold">{title.slice(0, 30)}...</Text>
              <Box h={'80px'}>
                <Text>{description.slice(0, 100)}...</Text>
              </Box>

              <Divider bg={'black'}></Divider>

              <Box h={'400px'}>
                <Image mt={4} w={'90%'} h={'350px'} src={image}></Image>
              </Box>
              <Flex mt={2} w={'100%'} alignItems={'center'} justifyContent={'space-between'}>
                <Text>{type} - {year}</Text>
                <Text>{rate_start} <Icon mb={-0.5} as={FcRating} /> - {votes} <Icon mb={-0.5} as={FcLike} /></Text>
              </Flex>
              <Button
                as={'a'}
                target='_blank'
                href={url_anime}
                //</Box>onClick={() => {
                //</Box>  setAberto(true);
                //</Box>  handleSaibaMais({
                //</Box>    title,
                //</Box>    description,
                //</Box>    year,
                //</Box>    type,
                //</Box>    rate_start,
                //</Box>    votes,
                //</Box>    status,
                //</Box>    followers,
                //</Box>    episodes,
                //</Box>    genders,
                //</Box>    url_anime,
                //</Box>    image,
                //</Box>    aberto,  // Adicione aberto como uma propriedade
                //</Box>  });
                //}}
                mt={6}
                colorScheme="blue"
                size="sm"
              >
                Saiba mais
              </Button>
            </Box>
          </GridItem>
        );

        // Atualiza o estado 'data' com o novo card
        setData((prevData) => [...prevData, card]);
      },
      abort(reason) {
        console.log('abortado**', reason);
      },
    });
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Box p="4">
        <Button colorScheme="green" onClick={handleStart}>
          Iniciar
        </Button>
        <Button colorScheme="red" ml="2" onClick={handleStop}>
          Parar
        </Button>
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap="4" mt="4">
          {data}
        </Grid>
      </Box>
    </ChakraProvider>
  );
}
