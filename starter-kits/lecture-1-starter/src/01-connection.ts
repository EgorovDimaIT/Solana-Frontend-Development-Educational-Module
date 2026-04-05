import { Connection, clusterApiUrl } from '@solana/web3.js';

export async function connectToSolana() {
    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
    );

    const version = await connection.getVersion();
    console.log('✅ Connected to Solana Devnet');
    console.log('Version:', JSON.stringify(version));

    const slot = await connection.getSlot();
    console.log('Current slot:', slot);

    return connection;
}

// Running immediately to verify
connectToSolana();
