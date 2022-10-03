import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { injected } from "./connectors";
import {Button, Flex} from '@chakra-ui/react'


export default function HomeWalletConnector() {
    const {active, account, activate, deactivate} = useWeb3React();
    const addressCopy = account;
    

    async function connect(){  
        try {
            await activate(injected);
            await addressCopy
            localStorage.setItem('isWalletConnected', true);
            
            if(account !== undefined) {
                localStorage.setItem('walletAccount', addressCopy)
            
            } 
            
        } catch(err) {
            console.log(err);
        }
       
    }
    
    async function disconnect() {  
        try {
            deactivate();
            localStorage.setItem('isWalletConnected', false);
            
            // localStorage.setItem('walletAccount', 'logged out');
            clearThat()
        } catch(err) {
            console.log(err);
        }
    }

    async function clearThat() {
        localStorage.removeItem("walletAccount")
    }

    useEffect(() => {
        const connectWalletOnLoad = async () => {
            if(localStorage?.getItem('isWalletConnected') === 'true') {
                try {
                    await activate(injected);
                    localStorage.setItem('isWalletConnected', true);
                    await account;
                    // console.log(account)
                    if(account !== undefined) {
                        let walletAccount = account
                        localStorage.setItem('walletAccount', walletAccount)
                    }   
                
                } catch (err) {
                    console.log(err)
                }
            }    
        }

        connectWalletOnLoad();
        // if(account !== undefined) {
        //     console.log(account)
        // }
    }, [account, activate])

    
    return (
        <div>
            <Flex alignItems="center" gap='2'>
            {active ? <div>Connected with <b>{account} </b> <Button onClick={disconnect} id="disconnect">Disconnect</Button></div> 
            : <Button onClick={connect}   bg='#F3BA2F' w="100%" colorScheme="blue">Connect to MetaMask</Button>}
            </Flex>
        </div>
    )
}