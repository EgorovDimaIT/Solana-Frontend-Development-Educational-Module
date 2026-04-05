// 01-connection.ts
import { Connection, clusterApiUrl } from '@solana/web3.js';

/**
 * Задача 1: Подключиться к Solana Devnet
 */

async function connectToSolana() {
    // TODO: Создайте подключение к devnet
    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
    );

    // Проверяем подключение
    const version = await connection.getVersion();
    console.log('✅ Connected to Solana Devnet');
    console.log('Version:', version);

    // Получаем последний блок
    const slot = await connection.getSlot();
    console.log('Current slot:', slot);

    return connection;
}

// ЗАДАНИЕ: Раскомментируйте и запустите
// connectToSolana();

export { connectToSolana };
