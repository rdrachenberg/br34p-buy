import {
    Button,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    useDisclosure,
    usePrefersReducedMotion,
    keyframes, 
  } from '@chakra-ui/react'

import HookForm  from './HookForm';
import Web3 from 'web3';
import {useEffect, useState} from 'react';

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')); // Local Development
// const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org')); // Mainnet Development

const spin = keyframes `from { transform: rotateX(0deg); } to { transform: rotateX(360deg); }`

  
function BasicBuyInfo(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [br34pBalance, setBR34PBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(false);
    const preferReducedMotion = usePrefersReducedMotion();

    const animation = preferReducedMotion ? undefined : `${spin} 1 1s linear`

    let signedInAccount = localStorage.getItem('walletAccount');
    
    const getBR34P = (balance) => {
      let convert = web3.utils.fromWei(balance, 'gwei') * 10;
      convert = convert.toFixed(3)
        console.log(convert);
        setBR34PBalance(convert);
    }

    useEffect(() => {
      if(br34pBalance !== 0) {
        setShowBalance(true)
      }
    }, [setShowBalance, br34pBalance])
    // console.log(test);
    return (
      <>
        {showBalance ? 
          <Text fontSize='3xl'>Your BR34P Balance: {br34pBalance}</Text> 
        : <></>
        } 
        <Image src="https://br34p.finance/img/imageonline-co-overlayed-image.png" onClick={onOpen} animation={animation} {...props}/>
        <Button onClick={onOpen}><Image src="https://br34p.finance/img/imageonline-co-overlayed-image.png" maxHeight='110%'/>Buy BR34P</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Buy BR34P</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <HookForm account={signedInAccount} onClose={onClose} isOpen={isOpen} getBR34P={getBR34P}/>
            </ModalBody>
            <ModalFooter>
              
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default BasicBuyInfo