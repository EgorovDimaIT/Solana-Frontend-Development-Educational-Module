import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

export async function createWallet() {
    const keypair = Keypair.generate();

    console.log('✅ Wallet created!');
    console.log('Public Key:', keypair.publicKey.toBase58());

    fs.writeFileSync(
        'wallet.json',
        JSON.stringify(Array.from(keypair.secretKey))
    );

    console.log('💾 Saved to wallet.json');

    return keypair;
}
