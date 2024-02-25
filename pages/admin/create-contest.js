import React, { useState } from 'react';
import { Select, ChakraProvider, FormLabel, Center, VStack, Input, Button, Progress, Text } from '@chakra-ui/react';
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import { v4 as uuidv4 } from 'uuid';


function SelectComponent() {
  const uuid = uuidv4();
  const [selectedOption, setSelectedOption] = useState('');
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [cinemaAwardInfo, setCinemaAwardInfo] = useState({
    name: '',
    year: ''
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCinemaAwardInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  console.log("ID gerado: ",uuid)

  const saveGames = () => {
    setIsSaved(false)
    setIsSaving(true)
    const data = {
      contestId: uuid,
      contestName: cinemaAwardInfo.name,
      contestType: selectedOption,
      contestYear: cinemaAwardInfo.year,
    };

    fetch('/api/postContest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        setIsSaving(false),
          setIsSaved(true)
        console.log('Jogo Salo Com Sucesso!', response);
      })
      .catch((error) => {
        setIsSaving(false),
          console.error('Erro ao salvar notícia:', error);
      });
  };

  return (
    <ChakraProvider>
      <Navbar />
      <Sidebar />



      <Center>
        <VStack>
          <FormLabel htmlFor="ordenation">Type</FormLabel>
          <Select
            id="ordenation"
            placeholder="Type"
            isRequired={true}
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="cinema-award">
              Premiação de Cinema
            </option>
            <option value="soccer">
              Campeonato de Futebol
            </option>
            <option value="soccer-award">
              Premiação de Futebol
            </option>
            <option value="basket-award">
              Premiação de Basket
            </option>
            <option value="reality-champion">
              Premiação de Reality
            </option>
          </Select>
          <br />
          {selectedOption === "cinema-award" && (
            <>
              <FormLabel htmlFor="championshipName">Nome da Premiação</FormLabel>
              <Input
                id="championshipName"
                name="name"
                placeholder="Enter championship name"
                type="text"
                value={cinemaAwardInfo.name}
                onChange={handleInputChange}
              />
              <br />
              <FormLabel htmlFor="championshipYear">Ano da Premiação</FormLabel>
              <Input
                id="championshipYear"
                name="year"
                placeholder="Enter championship year"
                type="text"
                value={cinemaAwardInfo.year}
                onChange={handleInputChange}
              />
              <br />
              <Center>
                <Button

                  colorScheme="blue"
                  onClick={saveGames}
                >
                  Salvar
                </Button>
              </Center>
              {isSaving ? <Progress size='xs' isIndeterminate /> : null}
              {isSaved ? <Text>Salvo</Text> : null}


            </>
          )}
        </VStack>


      </Center>

      

    </ChakraProvider>
  );
}

export default SelectComponent;
