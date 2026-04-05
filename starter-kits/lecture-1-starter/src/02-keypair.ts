// 02-keypair.ts
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

/**
 * Задача 2: Создать кошелёк (keypair)
 */

async function createWallet() {
    // Создаём новый keypair
    const keypair = Keypair.generate();

    console.log('✅ Wallet created!');
    console.log('Public Key:', keypair.publicKey.toBase58());
    console.log('Secret Key:', keypair.secretKey);

    // Сохраняем в файл
    fs.writeFileSync(
        'wallet.json',
        JSON.stringify(Array.from(keypair.secretKey))
    );

    console.log('💾 Saved to wallet.json');

    return keypair;
}

// ЗАДАНИЕ: Создайте свой кошелёк
// createWallet();

export { createWallet };
