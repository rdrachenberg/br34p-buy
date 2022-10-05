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


export default function HookForm(props) { // the HookForm function is the main function that executes the onSubmit function and actually calls the pancakeSwapRouter. This also takes props as a function parimeter which holds props.account props.onClose 
  const { active, account } = useWeb3React();
  const { onClose } = useDisclosure(); // the modal uses useDisclosure function from chakra-ui
  // console.log(props)
  // console.log(props.account);
  // Declare hook variables ******************************************
  const [value, setValue] = useState();
  const [connectedAcct, setconnectedAcct] = useState(props.account);

  const [transactionHash, setTransactionHash] = useState('');
  const [transactionReceipt, setTransactionReceipt] = useState('');

  const [displayTransaction, setDisplayTransaction] = useState(false);
  const [br34pBalance, setBR34PBalance] = useState(0);

  // function to handle slider or input value. 
  const handleChange = (value) => setValue(value);
  
  // useForm library *******************************
  const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => { // useEffect to track variable state changes. 
    if(transactionReceipt !== '') {
      console.log(transactionReceipt);
      setconnectedAcct(connectedAcct);
      setTransactionHash(transactionHash)
      setDisplayTransaction(true);
    }
  }, [transactionReceipt, connectedAcct, transactionHash]);

  // function will call on PancakeSwapRouter on form submit. Receives values as a function parameters
  async function onSubmit(values) {

    let provider = window.ethereum; // variable provider is instantiation of Metamask
    
    if(typeof provider !== 'undefined') { // if it is not undefined, request the accounts from Metamask
      provider.request({ method: 'eth_requestAccounts'})
      .then((accounts) => {
        console.log(accounts); // log accounts from metamask. 
      })
      .catch((err) => {
        console.log(err);
      }); 

      window.ethereum.on('accountsChanged', function(accounts) { // handle accounts changing in Metamask
        selectedAccount = accounts[0]; 

        console.log(`Selected account is changed to ${selectedAccount}`) // log change 
      });

    } 
      // const networkId = await web3.eth.net.getId(); // get the id from the web3 instance  
      // console.log(networkId); // log result

      const contract = new web3.eth.Contract(pancakeRouter, pancakeSwapRouterAddress, {from:account}) // set contract variable equal to PancakeSwapRouter
      const br34pContract = new web3.eth.Contract(br34pABI, br34pAddress, {from:account}); // set br34pContract equal to the BR34P web3 instance of Token Contract
      console.log(contract.methods) // log available PancakeSwapRouter Methods

      const amountOutMin = '100' + Math.random().toString().slice(2,6); // set minimum amount out. This is needed as the first function parameters when calling the swapEactETHForTokens method
      // console.log('below is the amountOutMin var')
      // console.log(amountOutMin);
      let buyAmount = web3.utils.toWei(values.value, 'ether'); // buyAmount will be the value passed in as a function parameters 
      // console.log(values.value);
      // console.log(buyAmount);

      let date = await web3.utils.toHex(Math.round(Date.now()/1000) + 60 * 20); // set date to now

      const data = await contract.methods.swapExactETHForTokens( // set data variable equal to swapExactETHForTokens PancakeSwapRouter Method
        web3.utils.toHex(amountOutMin),
        [WBNBAddress, br34pAddress],
        account,
        date
      );

      const count =  web3.eth.getTransactionCount(account); // transaction count

      // console.log(count)
      // console.log(typeof account)
      
      const tx = { // package the transaction object to send
        "from":account,
        "gasPrice":web3.utils.toHex(5000000000),
        "gasLimit":web3.utils.toHex(290000),
        "to":pancakeSwapRouterAddress,
        "value":web3.utils.toHex(buyAmount),
        "data":data.encodeABI(),
        "nonce":web3.utils.toHex(count)
      };

      // sign the transaction with Metamask
      const sign = await window.ethereum.request({method: 'eth_sendTransaction', params: [tx]}).then((txHash) => {
        console.log(txHash, '<<<<<< here is the transaction hash');
        setTransactionHash(txHash)
        return txHash
      });
      // console.log(sign);
      
      // get the transaction receipt and return the transactionReceipt 
      const txReceipt = await 
        web3.eth.getTransactionReceipt(sign).then((transactionInfo) => {
          setTransactionReceipt(transactionInfo)
          return transactionReceipt
      })
      // setTransactionReceipt(txReceipt)
      console.log(txReceipt); // log transaction receipt 


      // function to return the wallet balance of BR34P  
      const getThatBR34PBalance = await br34pContract.methods.balanceOf(account).call((res) => {
        console.log(res);
        
        setBR34PBalance(res);
        return br34pBalance;
      });

      setBR34PBalance(getThatBR34PBalance)
      // console.log(br34pBalance);  // testing 
      // console.log(getThatBR34PBalance);  // testing
      props.getBR34P(getThatBR34PBalance); // passing BR34P value of wallet to the props function getBR34P. This will allow for hoisted value to be displayed on parent component. 
      
      // console.log(getThatBR34PBalance); // testing
      // console.log(txReceipt); // testing
      // set a timeout that calls the onClose function passed in as props from the parent component. 
      return new Promise((resolve) => {
        setTimeout(() => {
          props.onClose(); // calling the onClose props function to handle modal close
          resolve();
        }, 8000)  
      })
  }

  return (
    <div>
      {displayTransaction?
        <div>
          Transaction successful 
          <p>blockNumber: {JSON.stringify(transactionReceipt.blockNumber)} </p>
          <p>transactionHash: {JSON.stringify(transactionReceipt.transactionHash)} </p>
          <p>mined? : {JSON.stringify(transactionReceipt.status)} </p>
          <p>BR34P Balance : {br34pBalance} </p>
        </div>
      :
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.buy}>
              <FormLabel htmlFor='value'>Buy BR34P with BNB(BSC)</FormLabel>
              <Flex>
                  <NumberInput maxW='100px' mr='2rem' value={value} onChange={handleChange} defaultValue={0.5} min={0.1} max={500} step={0.5} id='value'>
                      <NumberInputField  {...register('value', {
                      required: 'This is required'
                  })}/>
                      <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                      </NumberInputStepper>
                  </NumberInput>
                  <Slider flex='1' focusThumbOnChange={false} value={value} onChange={handleChange}>
                      <SliderTrack>
                      <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb fontSize='sm' boxSize='32px' children={value} />
                  </Slider>
            </Flex>
              <Spacer />
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