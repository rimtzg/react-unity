import { useState } from "react";

const WALLET = '0x2f318C334780961FB129D2a6c30D0763d9a5C970'

const useMetamask = () => {
    const [isInstalled, setIsInstalled] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState("0x");

    const checkIfMetaMaskInstalled = () => {
        const { ethereum } = window;
        if (Boolean(ethereum && ethereum.isMetaMask)) {
            setIsInstalled(true);
            return true;
        } else {
            console.log("No MetaMask detected. Please install and proceed!");
            return false;
        }
    }

    const checkIfMetaMaskConnected = async () => {
        if (isInstalled && !isConnected && typeof window.ethereum !== "undefined") {
            
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (accounts.length) {
                setIsConnected(true);
                setAccount(accounts[0]);
                console.log("Metamask is connected");
                return true;
            }
        }
    }

    const askMetaMaskTransaction = async() => {
        if (isInstalled && isConnected){
            //Sending Ethereum to an address
            const transaction = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: account,
                        to: WALLET,
                        value: '0x29a2241af62c0000',
                        gasPrice: '0x09184e72a000',
                        gas: '0x2710',
                    },
                ],
            })
            // .then((txHash) => { return txHash })
            // .catch((error) => console.error)

            console.log(transaction)
        }
    }

    const setMetaMaskAccount = () => {
        return account;
    }

    return {
        askMetaMaskTransaction,
        checkIfMetaMaskInstalled,
        checkIfMetaMaskConnected,
        setMetaMaskAccount,
        isMetaMaskInstalled : isInstalled,
        isMetaMaskConnected : isConnected,
        MetaMaskAccount : account
    }
};

export default useMetamask;