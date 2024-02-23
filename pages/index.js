import Head from 'next/head';
import {
  ChakraProvider,
  Box,
  Text,
  Center,
  Heading,
  Card,
  Stack,
  CardBody,
  Button,
  Image,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';

import { useEffect, useState } from 'react';

const Tips = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const getGames = async () => {
    try {
      const response = await fetch(`/api/get-games`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('Dados do usuário:', userData);
        setIsLoading(false);
        setData(userData);
      } else {
        if (response.status === 404) {
          setIsLoading(false);
        }
        console.error('Erro ao buscar o usuário:', response.status);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  };

  useEffect(() => {
    console.log('Chamou o useEffect');
    getGames();
    setIsLoading(true);
  }, []);

  // Salvar as tips

  const saveTips = async (index) => {
    setIsLoading(true);
    const user = 'jonas.zeferino@gmail.com';
    const { homeTip, awayTip } = data[index];

    try {
      // Aqui você pode usar diretamente os valores do estado atualizado
      const response = await fetch('/api/postTips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          awayTip,
          homeTip,
          user,
        }),
      });

      if (response.ok) {
        const { id } = await response.json();
        console.log('Palpite salvo com sucesso! ID:', id);
      } else {
        console.error('Erro ao salvar palpite:', response.status);
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar palpite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Sala de Secacao</title>
        <meta name="description" content="Site do Sala de Secacao" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Center>
        <Heading mt="200px">Palpites Dupla Grenal</Heading>
      </Center>

      <Center>
        <Box borderRadius="10px">
          {isLoading ? (
            <Text>Carregando...</Text>
          ) : (
            data.map((item, index) => (
              <Card
                key={index}
                display="flex"
                overflow="hidden"
                variant="outline"
                style={{ margin: '10px' }}
                mt="120px"
                width="600px"
              >
                <Box mt="20px">
                  <Center>
                    <Text>{item.date}</Text>
                    <br />
                  </Center>
                </Box>

                <Box mt="2px">
                  <Center>
                    <Text>{item.championship}</Text>
                    <br />
                  </Center>
                </Box>
                <Center></Center>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  justifyContent={{ base: 'center', md: 'space-between' }}
                  alignItems="center"
                  width="600px"
                >
                  <Box
                    textAlign={{ base: 'center', md: 'left' }}
                    mb={{ base: '4', md: '0' }}
                  >
                    <Image
                      objectFit="cover"
                      maxW={{ base: '100%', sm: '150px' }}
                      boxSize="150px"
                      borderRadius="10px"
                      src={item.homeClubData}
                      alt="Imagem do Time de Casa"
                      loading="lazy"
                      ml="25px"
                      mt="25px"
                    />
                    <Stack>
                      <CardBody>
                        <Center>
                          <Text>{item.home_club}</Text>
                        </Center>
                      </CardBody>
                    </Stack>
                  </Box>

                  <FormControl id="clubName" p="10px">
                    <Input
                      id={`homeTip_${index}`}
                      type="number"
                      value={item.homeTip}
                    />
                  </FormControl>

                  <Center>
                    <Heading>X</Heading>
                  </Center>
                  <FormControl id="clubName" p="10px">
                    <Input
                      id={`awayTip_${index}`}
                      type="number"
                      value={item.awayTip}
                    />
                  </FormControl>

                  <Box
                    textAlign={{ base: 'center', md: 'right' }}
                    ml={{ base: '0', md: '4' }}
                  >
                    <Image
                      objectFit="cover"
                      maxW={{ base: '100%', sm: '150px' }}
                      boxSize="150px"
                      borderRadius="10px"
                      src={item.awayClubData}
                      alt="Imagem do Time de Fora"
                      loading="lazy"
                      mr="25px"
                      mt="25px"
                    />
                    <Stack>
                      <CardBody>
                        <Center>
                          <Text>{item.away_club}</Text>
                        </Center>
                      </CardBody>
                    </Stack>
                  </Box>
                </Box>

                <Box mt="4" textAlign="center">
                  <Button onClick={() => saveTips(index)}>
                    Salvar Palpites
                  </Button>
                </Box>
              </Card>
            ))
          )}
        </Box>
      </Center>


    </ChakraProvider>
  );
};

export default Tips;
