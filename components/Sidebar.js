import React from 'react';
import Link from 'next/link';
import { Box, Flex, Text, ChakraProvider, Image, Grid } from '@chakra-ui/react';

const Sidebar = () => {
    return (
        <ChakraProvider>
            <Grid templateColumns="200px 1fr" gap={4}>
                <Box
                    bg="black"
                    py={4}
                    position="fixed"
                    h="100vh"
                    left={0}
                    top={0}
                    zIndex={1}
                >
                    <Flex direction="column" align="center" justify="center">
                        <br />
                        <Link href="/admin/create-contest">
                            <Text color="white" py={2}>
                                Disputas
                            </Text>
                        </Link>
 
                    </Flex>
                </Box>
                <Box pl="200px"> {/* Espaço para a barra lateral */}</Box>
            </Grid>
        </ChakraProvider>
    );
};

export default Sidebar;
