import { useEffect } from "react";

import useMetamask from "../hooks/useMetamask"
import usePhantom from "../hooks/usePhantom"

function Wallets() {
    const { isMetaMaskInstalled, isMetaMaskConnected, checkIfMetaMaskInstalled, checkIfMetaMaskConnected, askMetaMaskTransaction } = useMetamask()
    const { isPhantomInstalled, isPhantomConnected, checkIfPhantomInstalled, checkIfPhantomConnected, askPhantomTransaction } = usePhantom()

    function handleAskPhantomTransaction(){
        let signature = askPhantomTransaction()
        console.log(signature)
    }

    function handleAskMetaMaskTransaction(){
        let signature = askMetaMaskTransaction()
        console.log(signature)
    }

    function handleConnectMetamask(){
        checkIfMetaMaskConnected()
    }

    function handleConnectPhantom(){
        checkIfPhantomConnected()
    }

    useEffect(() => {
        checkIfMetaMaskInstalled()
        checkIfPhantomInstalled()
    }, [checkIfMetaMaskInstalled, checkIfPhantomInstalled])

    return (
        <div>
            <div>
                <button onClick={handleAskPhantomTransaction}>Login Fractal</button>
            </div>
            <div>
                { isMetaMaskInstalled ? <button onClick={handleConnectMetamask}>Connect to Metamask</button> : null }
                { isMetaMaskConnected ? <button onClick={handleAskMetaMaskTransaction}>Ask transaction</button> : null}
            </div>
            <div>
                { isPhantomInstalled ? <button onClick={handleConnectPhantom}>Connect to Phantom</button> : null }
                { isPhantomConnected ? <button onClick={handleAskPhantomTransaction}>Ask transaction</button> : null}
            </div>
        </div>
    )
}

export default Wallets;