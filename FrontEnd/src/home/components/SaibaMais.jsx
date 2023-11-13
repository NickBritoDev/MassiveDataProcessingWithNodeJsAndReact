import { Box, Text } from '@chakra-ui/react'
import React from 'react'

export default function SaibaMais( {title, description, year, type, rate_start, votes, status, followers, episodes, genders, url_anime, image , aberto}) {
  console.log(title, description, year, type, rate_start, votes, status, followers, episodes, genders, url_anime, image, aberto)



  return (
    <Box top={0} pos={'fixed'} bg={'white'} w={'100%'} h={'100vh'}>
      <Text>Saiba Mais</Text>
    </Box>
  )
}
