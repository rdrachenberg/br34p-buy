import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from 'web3'

import BasicBuyInfo from './Modal';

function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  return (
    <div>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ChakraProvider theme={theme}>
          <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
              <ColorModeSwitcher justifySelf="flex-end" />
              <VStack spacing={8}>
                <BasicBuyInfo />
              </VStack>
            </Grid>
          </Box>
        </ChakraProvider>
      </Web3ReactProvider>
    </div>
  );
}

export default App;
