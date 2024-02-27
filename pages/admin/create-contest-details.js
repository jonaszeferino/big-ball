import React, { useState, useEffect } from 'react';
import { Select, ChakraProvider, FormLabel, Center, VStack, Input, Button, Progress, Text, Box, UnorderedList, ListItem, Checkbox } from '@chakra-ui/react';
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
  const [reciveCinemaSaved, setReciveCinemaSaved] = useState([])
  const [selectedDetailsIds, setSelectedDetailsIds] = useState([])
  const [deleteActive, setDeleteActive] = useState(false)


  const handleDetailSelection = (event) => {
    const { checked } = event.target;
    const updatedSelectedDetailsIds = checked
      ? [...selectedDetailsIds, event.target.id]
      : selectedDetailsIds.filter((detailId) => detailId !== event.target.id);
    setSelectedDetailsIds(updatedSelectedDetailsIds);
    setDeleteActive(updatedSelectedDetailsIds.length > 0);
  };


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

  const getContestComplete = () => {
    fetch('/api/postReciveContestComplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contestId: selectedContestId
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao obter detalhes do concurso');
        }
        return response.json();
      })
      .then((data) => {
        setReciveCinemaSaved(data);
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

  const deleteDetails = () => {

    if (selectedContestId && selectedDetailsIds.length > 0) {
      const data = {
        contestDetailsIds: selectedDetailsIds
      };
      fetch('/api/deleteContestDetails', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            setIsSaved(true);
          } else {
            throw new Error('Erro ao excluir detalhes do concurso');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('Nenhum concurso selecionado ou contestDetailsIds não definido');
    }
  };


  useEffect(() => {
    const selectedContest = contests.find(contest => contest.contestType === selectedOption);
    if (selectedContest) {
      setSelectedContestId(selectedContest.contestId);
    }
  }, [selectedOption, contests]);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(`/api/getDetails/${selectedContestId}`);
      const details = await response.json();
      setReciveCinemaSaved(details);
    };
    fetchDetails();
  }, [selectedContestId, selectedDetailsIds]);


  return (
    <ChakraProvider>
      <Navbar />
      <Sidebar />
      <Center>
        <VStack>
          <FormLabel htmlFor="ordenation">Escolha a Competição Salva</FormLabel>
          <Select
            id="ordenation"
            placeholder="Escolha a Competição"
            isRequired={true}
            isDisabled={isSaved}
            value={selectedOption}
            onChange={(event) => {
              handleChange(event);
              getContestComplete();
            }}
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
                isDisabled={isSaved}
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
                    isDisabled={isSaved}
                    value={competitor}
                    onChange={(event) => handleCompetitorChange(event, index)}
                  />
                </div>
              ))}
              <Button
                colorScheme="blue"
                onClick={addCompetitor}
                isDisabled={isSaved}
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
                Novos Candidatos
              </Button>
            </>
          )}
        </VStack>
      </Center>
      <br />
      <br />
      <Center>
        <Text><strong>Premios Cadastrados: </strong></Text>
      </Center>
      <Center>

        <Box>
          {reciveCinemaSaved.map((contest) => (
            <Box key={contest._id} marginBottom="20px">
              <Center>
                <Text as="h3"><strong>{contest.contestName}</strong></Text>
              </Center>
              {contest.contestDetails.map((detail) => (
                <Box key={detail._id} marginTop="10px">
                  <Text as="h4"><strong>Premio: {detail.contestDetailName}</strong> </Text>
                  <Checkbox
                    id={detail.contestDetailsId}
                    isChecked={selectedDetailsIds.includes(detail.contestDetailsId)}
                    onChange={(event) => {
                      handleDetailSelection(event, detail.contestDetailsId);

                    }}
                  >
                    {detail.contestDetailName}
                  </Checkbox>

                  <UnorderedList>
                    {detail.competitors && detail.competitors.map((competitor) => (
                      <ListItem key={competitor}>{competitor}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Center>

      {deleteActive ?
        <Center>
          <Button onClick={deleteDetails} colorScheme="red">Deletar</Button>
        </Center> : null}
    </ChakraProvider>
  );

}

export default SelectComponent;
