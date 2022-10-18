import './App.css';

import React, { useState, useEffect, useCallback } from "react";

import { PublicKey, Transaction } from "@solana/web3.js";
import { Unity, useUnityContext } from "react-unity-webgl";

function getProvider(){
    if ("solana" in window) {
        const provider = window.solana;

        // console.log(provider)

        if (provider.isPhantom){
            console.log('Habemus phantom')

            return provider
        }
    }
}

function App() {
    const [publicKey, setPublicKey] = useState()
    const [provider, setProvider] = useState(getProvider())
    
    const { loadingProgression, unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl    : "game/game.loader.js",
        dataUrl      : "game/game.data",
        frameworkUrl : "game/game.framework.js",
        codeUrl      : "game/game.wasm",
    });

    function handleClickMessage(){
        sendMessage("GameController", "PrintMessage", "ASDF")
    }

    const handleClickPhantom = useCallback( async() => {
        console.log('Connect to Phantom')

        // console.log(provider)

        let provider = getProvider()
        let connection = await provider.connect()
        let pubkey = await provider.publicKey

        // console.log(pubkey.toString())

        setPublicKey(pubkey.toString())

        sendMessage("GameController", "PrintMessage", pubkey.toString())
    }, [])

    useEffect(() => {
        if (provider){
            sendMessage("GameController", "IsPhantom")
        }

        addEventListener("ClickPhantom", handleClickPhantom)
        return () => {
            removeEventListener("ClickPhantom", handleClickPhantom)
        }
    }, [addEventListener, removeEventListener, handleClickPhantom])

    return (
        <div className="App">
            <Unity style={{width:'100%',height:"80vh"}} unityProvider={unityProvider} />
            <button onClick={handleClickMessage}>Send message</button>
        </div>
    )
}

export default App;
