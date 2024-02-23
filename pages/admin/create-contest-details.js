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
  const [contests, setContests] = useState([])



  const [contestInfo, setContestInfo] = useState({
    name: '',
    year: '',
    competitors: []
  });


  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContestInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addCompetitor = () => {
    setContestInfo(prevState => ({
      ...prevState,
      competitors: [...prevState.competitors, contestInfo.year]
    }));
    setContestInfo(prevState => ({
      ...prevState,
      year: ''
    }));
  };

  const saveGames = () => {
    setIsSaved(false)
    setIsSaving(true)
    const data = {
      contestDetaislId,
      contestlId,
      contestDetailName,
      competitors: contestInfo.competitors
    };

    fetch('/api/postContestDetails', {
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

  const getContest = () => {
    fetch('/api/getContest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then((response) => {

        if (!response.ok) {
          throw new Error('Erro ao obter detalhes do concurso');
        }
        return response.json(); // Converte a resposta em JSON
      })
      .then((data) => {
        setContests(data)
        console.log('Dados do concurso:', data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error);
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
              <FormLabel htmlFor="championshipName">Nome do Premio</FormLabel>
              <Input
                id="championshipName"
                name="name"
                placeholder="Enter championship name"
                type="text"
                value={contestInfo.name}
                onChange={handleInputChange}
              />
              <br />
              <FormLabel htmlFor="championshipYear">Concorrentes</FormLabel>
              {contestInfo.competitors.map((competitor, index) => (
                <div key={index}>
                  <Input
                    id={`competitor-${index}`}
                    name={`competitor-${index}`}
                    placeholder={`Enter competitor ${index + 1}`}
                    type="text"
                    value={competitor}
                    disabled
                  />
                </div>
              ))}
              <Input
                id="championshipYear"
                name="year"
                placeholder="Enter competitor"
                type="text"
                value={contestInfo.year}
                onChange={handleInputChange}
              />
              <Button
                colorScheme="blue"
                onClick={addCompetitor}
              >
                Adicionar Concorrente
              </Button>
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



              <Button
                colorScheme="blue"
                onClick={getContest}
              >
                Salvar
              </Button>





            </>
          )}
        </VStack>
      </Center>
    </ChakraProvider>
  );
}

export default SelectComponent;
