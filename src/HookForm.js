import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useWeb3React } from "@web3-react/core";

import HomeWalletConnector from './WalletConnector';
import {
  FormLabel,
  FormControl,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spacer,
  useDisclosure,

} from '@chakra-ui/react'
import Web3 from 'web3';
import pancakeRouter from './contracts/pancake-router-abi.json';
import br34pABI from './contracts/br34p-abi.json'

let selectedAccount;

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')); // Local development
// const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org')); // Mainnet development
const br34pAddress = '0xa86d305A36cDB815af991834B46aD3d7FbB38523'; // BR34P contract address
const pancakeSwapRouterAddress = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';
const WBNBAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // WBNB token address


export default function HookForm(props) {
  const { active, account } = useWeb3React();
  const { onClose } = useDisclosure()

  console.log(props)
  
  // console.log(props.account);
  const [value, setValue] = useState();
  const [connectedAcct, setconnectedAcct] = useState(props.account);
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionReceipt, setTransactionReceipt] = useState('')
  const [displayTransaction, setDisplayTransaction] = useState(false);
  const [br34pBalance, setBR34PBalance] = useState(0);

  const handleChange = (value) => setValue(value);
  
  const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if(transactionReceipt !== '') {
      console.log(transactionReceipt);
      setconnectedAcct(connectedAcct);
      setTransactionHash(transactionHash)
      setDisplayTransaction(true);
    }
  }, [transactionReceipt, connectedAcct, transactionHash]);

  async function onSubmit(values) {

    let provider = window.ethereum;
    
    if(typeof provider !== 'undefined') {
      provider.request({ method: 'eth_requestAccounts'})
      .then((accounts) => {
        console.log(accounts);
      })
      .catch((err) => {
        console.log(err);
      }); 

      window.ethereum.on('accountsChanged', function(accounts) {
        selectedAccount = accounts[0];

        console.log(`Selected account is changed to ${selectedAccount}`)
      });

    } 
    
      const networkId = await web3.eth.net.getId();
      console.log(networkId);

      const contract = new web3.eth.Contract(pancakeRouter, pancakeSwapRouterAddress, {from:account})
      const br34pContract = new web3.eth.Contract(br34pABI, br34pAddress, {from:account});
      console.log(contract.methods)

      const amountOutMin = '100' + Math.random().toString().slice(2,6);
      // console.log('below is the amountOutMin var')
      // console.log(amountOutMin);
      let buyAmount = web3.utils.toWei(values.value, 'ether');
      // console.log(values.value);
      // console.log(buyAmount);

      let date = await web3.utils.toHex(Math.round(Date.now()/1000) + 60 * 20);
      const data = await contract.methods.swapExactETHForTokens(
        web3.utils.toHex(amountOutMin),
        [WBNBAddress, br34pAddress],
        account,
        date
      );

      const count =  web3.eth.getTransactionCount(account);

      // console.log(count)
      // console.log(typeof account)
      
      const tx = {
        "from":account,
        "gasPrice":web3.utils.toHex(5000000000),
        "gasLimit":web3.utils.toHex(290000),
        "to":pancakeSwapRouterAddress,
        "value":web3.utils.toHex(buyAmount),
        "data":data.encodeABI(),
        "nonce":web3.utils.toHex(count)
      };

      // let transaction = new Transaction(tx);

      const sign = await window.ethereum.request({method: 'eth_sendTransaction', params: [tx]}).then((txHash) => {
        console.log(txHash, '<<<<<< here is the transaction hash');
        setTransactionHash(txHash)
        return txHash
      })
      // console.log(sign);
      
      const txReceipt = await 
        web3.eth.getTransactionReceipt(sign).then((transactionInfo) => {
          setTransactionReceipt(transactionInfo)
          return transactionReceipt
      })
      // setTransactionReceipt(txReceipt)
      console.log(txReceipt);
        
      const getThatBR34PBalance = await br34pContract.methods.balanceOf(account).call((res) => {
        console.log(res);
        
        setBR34PBalance(res);
        return br34pBalance;
      });

      setBR34PBalance(getThatBR34PBalance)
        console.log(br34pBalance);
        console.log(getThatBR34PBalance)
        props.getBR34P(getThatBR34PBalance);
      
      // console.log(getThatBR34PBalance)
      // console.log(txReceipt)
      

      return new Promise((resolve) => {
        // console.log(sign);
        setTimeout(() => {
          console.log(account);
            // console.log(transactionReceipt)
          props.onClose();
          
          resolve();
          return;
        }, 8000)
          
      })
      
  }

  return (<div>
  
    {displayTransaction?<form>
    Transaction successful 
    <p>blockNumber: {JSON.stringify(transactionReceipt.blockNumber)} </p>
    <p>transactionHash: {JSON.stringify(transactionReceipt.transactionHash)} </p>
    <p>mined? : {JSON.stringify(transactionReceipt.status)} </p>
    <p>BR34P Balance : {br34pBalance} </p>
    </form>
  :
  <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.buy}>
        <FormLabel htmlFor='value'>Buy BR34P with BNB(BSC)</FormLabel>
        <Flex>
            <NumberInput maxW='100px' mr='2rem' value={value} onChange={handleChange} defaultValue={0.5} min={0.1} max={150} step={0.5} id='value'>
                <NumberInputField  {...register('value', {
                required: 'This is required'
            })}/>
                <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <Slider
                flex='1'
                focusThumbOnChange={false}
                value={value}
                onChange={handleChange}
            >
                <SliderTrack>
                <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize='sm' boxSize='32px' children={value} />
            </Slider>
            
       </Flex>
        {/* <Spacer /> */}
      </FormControl>
      {active?
        <Button mt={12} bg='#F3BA2F' w="100%" colorScheme="green" onClick={onClose} isLoading={isSubmitting} type='submit'>
          <ArrowForwardIcon></ArrowForwardIcon>Buy
        </Button>
      :
        <>
          <Spacer marginBlock={"12%"} />
          <HomeWalletConnector  />
        </>
      }
    </form>
    }
    </div>
  )
}