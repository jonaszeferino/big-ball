import React, { useState, useEffect } from 'react';
import { Select, ChakraProvider, FormLabel, Center, VStack, Input, Button, Progress, Text } from '@chakra-ui/react';
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import { v4 as uuidv4 } from 'uuid';

function SelectComponent() {
  const uuid = uuidv4();
  const [selectedOption, setSelectedOption] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contests, setContests] = useState([]);
  const [contestInfo, setContestInfo] = useState({
    name: '',
    competitors: []
  });
  const [selectedContestId, setSelectedContestId] = useState('');
  const handleClean = (event) => {
    setSelectedOption('');
    setIsSaved(false);
    setContestInfo(prevState => ({
      ...prevState,
      name: '',
      competitors: []
    }));
  };
  useEffect(() => {
    getContest();
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    const selectedContest = contests.find(contest => contest.contestType === value);
    if (selectedContest) {
      setSelectedContestId(selectedContest.contestId); 
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContestInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addCompetitor = () => {
    setContestInfo(prevState => {
      const newState = { ...prevState };
      if (newState.competitors.length === 0) {
         newState.contestlId = selectedContestId;
      }
      return {
        ...newState,
        competitors: [...newState.competitors, '']
      };
    });
  };

  const handleCompetitorChange = (event, index) => {
    const { value } = event.target;
    setContestInfo(prevState => ({
      ...prevState,
      competitors: prevState.competitors.map((competitor, i) =>
        i === index ? value : competitor
      )
    }));
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
        return response.json();
      })
      .then((data) => {
        setContests(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveGames = () => {
    setIsSaved(false);
    setIsSaving(true);

    if (selectedContestId) {
      const data = {
        contestDetailsId: uuid,
        contestId: selectedContestId,
        contestDetailName: contestInfo.name,
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
          setIsSaving(false);
          setIsSaved(true);
        })
        .catch((error) => {
          setIsSaving(false);
        });
    } else {
      console.error('Nenhum concurso selecionado');
    }
  };

  useEffect(() => {
    const selectedContest = contests.find(contest => contest.contestType === selectedOption);
    if (selectedContest) {
      setSelectedContestId(selectedContest.contestId);
    }
  }, [selectedOption, contests]);


  console.log("ID do contest Principal:", selectedContestId)

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
            {contests.map((contest) => (
              <option key={contest._id} value={contest.contestType}>
                {contest.contestName} - {contest.contestYear} - {contest.contestType}
              </option>
            ))}
          </Select>
  
          <br />
          {selectedOption === "cinema-award" && (
            <>
              <FormLabel htmlFor="championshipName">Nome do Prêmio</FormLabel>
              <Input
                id="championshipName"
                name="name"
                placeholder="Nome do Prêmio"
                type="text"
                value={contestInfo.name}
                onChange={handleInputChange}
              />
              <br />
  
              <FormLabel htmlFor="championshipYear">Concorrentes</FormLabel>
              {contestInfo.competitors && contestInfo.competitors.map((competitor, index) => (
                <div key={index}>
                  <Input
                    id={`competitor-${index}`}
                    name={`competitor-${index}`}
                    placeholder={`Nome do Competidor ${index + 1}`}
                    type="text"
                    value={competitor}
                    onChange={(event) => handleCompetitorChange(event, index)}
                  />
                </div>
              ))}
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
                  isDisabled={isSaved}
                >
                  Salvar
                </Button>
              </Center>
              {isSaving ? <Progress size='xs' isIndeterminate /> : null}
              {isSaved ? <Text>Salvo</Text> : null}
              <Button
                colorScheme="blue"
                onClick={handleClean}
              >
                Novo Prêmio
              </Button>
            </>
          )}
        </VStack>
      </Center>
    </ChakraProvider>
  );
  
}

export default SelectComponent;
