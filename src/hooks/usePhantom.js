import { useState } from "react";

import { LAMPORTS_PER_SOL, Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { getMint, getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token'

const TOKEN = '8qiGgayKGDfpt3VG6oa47qnzF4Ju3K12Ez2C6vMzsdTk'
const WALLET_SERVER = 'GRUNFFV9KCYLLiPHn32DoEfzQNG6J9JTVf1D8bMKZh61'

const usePhantom = () => {
    const [isInstalled, setIsInstalled] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [account, setAccount] = useState("0x")

    const checkIfPhantomInstalled = () => {
        const { solana } = window;
        if (Boolean(solana && solana.isPhantom)) {
            setIsInstalled(true)
            console.log("Habemus phantom!")
            return true
        }else{
            console.log("No Pahntom detected. Please install and proceed!")
            return false
        }
    }

    const checkIfPhantomConnected = async () => {
        if (isInstalled) {
            let provider = window.solana
            await provider.connect()

            setIsConnected(true)
            setAccount(provider)
        }
    }

    const askPhantomTransaction = async () => {
        if(isInstalled && isConnected){
            // Connect to cluster
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
            let blockhash = (await connection.getLatestBlockhash("finalized")).blockhash
            console.log('Endpoint: ', connection.rpcEndpoint)

            // Construct wallet keypairs
            const fromWallet = account
            await fromWallet.connect()
            console.log('From Wallet: ', fromWallet.publicKey)

            // Get token mint
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

            return signature
        }else{
            return null
        }
    }

    const setPhantomAccount = () => {
        return account;
    }

    return {
        askPhantomTransaction,
        checkIfPhantomInstalled,
        checkIfPhantomConnected,
        setPhantomAccount,
        isPhantomInstalled : isInstalled,
        isPhantomConnected : isConnected,
        PhantomAccount : account
    }
};

export default usePhantom;