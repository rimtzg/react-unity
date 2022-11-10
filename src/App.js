import './App.css';

// import { Buffer } from "buffer";
// Buffer.from("anything", "base64");
// window.Buffer = window.Buffer || require("buffer").Buffer;

import React, { useState, useEffect, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

import { LAMPORTS_PER_SOL, Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { transfer, getMint, getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token'

import { GoogleLogin } from '@react-oauth/google'

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

const responseGoogle = (response) => {
  console.log(response);
}

function App() {
    const [publicKey, setPublicKey] = useState()
    const [provider, setProvider] = useState()
    
    const { loadingProgression, unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl    : "game/game.loader.js",
        dataUrl      : "game/game.data",
        frameworkUrl : "game/game.framework.js",
        codeUrl      : "game/game.wasm",
    });

    function handleClickMessage(){
        sendMessage("GameController", "PrintMessage", "ASDF")
    }

    async function handleAskTransaction(){
        const TOKEN = '8qiGgayKGDfpt3VG6oa47qnzF4Ju3K12Ez2C6vMzsdTk'
        const WALLET_SERVER = 'GRUNFFV9KCYLLiPHn32DoEfzQNG6J9JTVf1D8bMKZh61'

        // Connect to cluster
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        let blockhash = (await connection.getLatestBlockhash("finalized")).blockhash
        console.log('Endpoint: ', connection.rpcEndpoint)

        // Construct wallet keypairs
        const fromWallet = getProvider()
        await fromWallet.connect()
        console.log('From Wallet: ', fromWallet.publicKey)

        // Create new token mint
        const mint = await getMint(connection, new PublicKey(TOKEN))
        console.log('Mint: ', mint.address)

        // Create associated token accounts for my token if they don't exist yet
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint.address,
            fromWallet.publicKey
        )
        console.log('Token From: ', fromTokenAccount.address)

        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint.address,
            new PublicKey(WALLET_SERVER)
        )
        console.log('Token To:', toTokenAccount.address)

        // Create the transaction
        const transaction = new Transaction({
            recentBlockhash : blockhash,
            feePayer : fromWallet.publicKey
        }).add(
            createTransferInstruction(
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                1*LAMPORTS_PER_SOL
            )
        )
        console.log(transaction)

        // Sign and send the transaction
        const { signature } = await fromWallet.signAndSendTransaction(transaction)

        console.log(signature)
    }

    const handleClickPhantom = useCallback( async() => {
        console.log('Connect to Phantom')

        // console.log(provider)

        let provider = getProvider()
        let connection = await provider.connect()
        let pubkey = await provider.publicKey

        // console.log(pubkey.toString())

        setPublicKey(pubkey.toString())

        sendMessage("GameController", "GetNFTs", pubkey.toString())
    }, [sendMessage])

    const checkIfPhantom = useCallback( async() => {
        console.log('Unity check if phantom')

        let provider = getProvider()

        if (provider){
            setProvider(provider)
            sendMessage("GameController", "IsPhantom")
        }
    }, [sendMessage])

    // useEffect(() => {
    //     setTimeout(() => {
    //         let provider = getProvider()

    //         setProvider(provider)
    //     }, 2000);
    // })

    // useEffect(() => {
    //     addEventListener("CheckIfPhantom", checkIfPhantom)
    //     return () => {
    //         removeEventListener("CheckIfPhantom", checkIfPhantom)
    //     }
    // }, [addEventListener, removeEventListener, checkIfPhantom])

    useEffect(() => {
        // let provider = getProvider()

        // if (provider){
        //     setProvider(provider)
        //     sendMessage("GameController", "IsPhantom")
        // }

        addEventListener("ClickPhantom", handleClickPhantom)
        addEventListener("CheckIfPhantom", checkIfPhantom)
        return () => {
            removeEventListener("ClickPhantom", handleClickPhantom)
            removeEventListener("CheckIfPhantom", checkIfPhantom)
        }
    }, [addEventListener, removeEventListener, handleClickPhantom, checkIfPhantom])

    return (
        <div className="App">
            <Unity style={{width:'100%',height:"80vh"}} unityProvider={unityProvider} />
            <button onClick={handleClickMessage}>Send message</button>
            <button onClick={handleAskTransaction}>Ask transaction</button>
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
            />
        </div>
    )
}

export default App;
