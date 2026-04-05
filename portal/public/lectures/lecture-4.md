# Lecture 4: Production-Ready dApp Patterns

## 🎯 Learning Objectives

After this lecture, you will be able to:
- Optimize RPC requests for production environments
- Handle transaction errors professionally
- Simulate transactions before broadcasting them
- Deploy dApps securely to Mainnet

---

## ⚡ RPC Optimization

### Problems with Free RPCs

```typescript
// ❌ PROBLEM: Free public RPC
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Rate limit: ~100 req/sec
// High latency
// No WebSocket support
// Often fails during peak load
```

### Solution: Paid RPC + Connection Pooling

```typescript
// ✅ CORRECT: Paid RPC with proper settings
const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL!,
  {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
    wsEndpoint: process.env.NEXT_PUBLIC_WS_URL,
  }
);
```

### Batching Requests

```typescript
// ❌ 100 individual requests = 100 * RTT latency
const balances = await Promise.all(
  addresses.map(addr => connection.getBalance(new PublicKey(addr)))
);

// ✅ One request = 1 * RTT
const accountInfos = await connection.getMultipleAccountsInfo(
  addresses.map(addr => new PublicKey(addr))
);

const balances = accountInfos.map(info => info?.lamports ?? 0);
```

### Application-Level Caching

```typescript
// lib/rpc-cache.ts
class RPCCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private TTL: Record<string, number> = {
    balance: 30_000,        // 30 seconds
    tokenAccounts: 60_000,  // 1 minute
    nfts: 300_000,          // 5 minutes
    programAccounts: 120_000,
  };

  async get<T>(
    key: string,
    type: keyof typeof this.TTL,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.TTL[type]) {
      return cached.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  invalidateAll() {
    this.cache.clear();
  }
}

export const rpcCache = new RPCCache();

// Usage:
const balance = await rpcCache.get(
  `balance:${walletAddress}`,
  'balance',
  () => connection.getBalance(new PublicKey(walletAddress))
);
```

---

## 🛡️ Transaction Simulation (Mandatory!)

### Why Simulate?

Simulation lets you verify a transaction **before** sending it:
- Check for sufficient SOL
- Detect program logic errors
- Preview results for the user
- Avoid wasting gas on failed transactions

```typescript
// lib/simulate-transaction.ts
import {
  Connection,
  Transaction,
  VersionedTransaction,
  SimulatedTransactionResponse,
} from '@solana/web3.js';

interface SimulationResult {
  success: boolean;
  logs: string[];
  unitsConsumed: number;
  error?: string;
  accountChanges?: {
    address: string;
    before: number;
    after: number;
    delta: number;
  }[];
}

export async function simulateTransaction(
  connection: Connection,
  transaction: Transaction | VersionedTransaction
): Promise<SimulationResult> {
  try {
    let response: SimulatedTransactionResponse;

    if (transaction instanceof VersionedTransaction) {
      const { value } = await connection.simulateTransaction(transaction, {
        sigVerify: false,
        replaceRecentBlockhash: true,
      });
      response = value;
    } else {
      const { value } = await connection.simulateTransaction(transaction, []);
      response = value;
    }

    if (response.err) {
      return {
        success: false,
        logs: response.logs ?? [],
        unitsConsumed: response.unitsConsumed ?? 0,
        error: parseTransactionError(response.err),
      };
    }

    return {
      success: true,
      logs: response.logs ?? [],
      unitsConsumed: response.unitsConsumed ?? 0,
    };
  } catch (error: any) {
    return {
      success: false,
      logs: [],
      unitsConsumed: 0,
      error: error.message,
    };
  }
}

// Parsing Solana errors into readable messages
function parseTransactionError(err: any): string {
  if (typeof err === 'string') return err;

  if (err.InstructionError) {
    const [index, errorType] = err.InstructionError;
    if (typeof errorType === 'object' && errorType.Custom !== undefined) {
      return `Instruction ${index} failed with custom error: ${errorType.Custom}`;
    }
    return `Instruction ${index} failed: ${JSON.stringify(errorType)}`;
  }

  if (err.AccountNotFound) {
    return 'Account not found on chain';
  }

  if (err.InsufficientFundsForFee) {
    return 'Insufficient SOL for transaction fee';
  }

  return JSON.stringify(err);
}
```

### UI Component for Simulation

```typescript
// components/TransactionPreview.tsx
'use client';

import { useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { simulateTransaction } from '@/lib/simulate-transaction';

interface Props {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransactionPreview({ transaction, onConfirm, onCancel }: Props) {
  const { connection } = useConnection();
  const [simResult, setSimResult] = useState<any>(null);
  const [simLoading, setSimLoading] = useState(false);

  const simulate = async () => {
    setSimLoading(true);
    const result = await simulateTransaction(connection, transaction);
    setSimResult(result);
    setSimLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Transaction Preview</h2>

        {/* Simulation */}
        <div className="mb-6">
          <button
            onClick={simulate}
            disabled={simLoading}
            className="bg-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-500 transition"
          >
            {simLoading ? '⏳ Simulating...' : '🔍 Simulate Transaction'}
          </button>

          {simResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              simResult.success
                ? 'bg-green-900/30 border-green-700'
                : 'bg-red-900/30 border-red-700'
            }`}>
              <p className="font-bold mb-2">
                {simResult.success ? '✅ Simulation Passed' : '❌ Simulation Failed'}
              </p>
              {simResult.error && (
                <p className="text-red-400 text-sm">{simResult.error}</p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Compute Units: {simResult.unitsConsumed.toLocaleString()}
              </p>
              {simResult.logs.length > 0 && (
                <details className="mt-2">
                  <summary className="text-gray-400 text-sm cursor-pointer">
                    View Logs ({simResult.logs.length})
                  </summary>
                  <pre className="text-xs mt-2 text-gray-300 overflow-auto max-h-32">
                    {simResult.logs.join('\n')}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={simResult && !simResult.success}
            className="flex-1 bg-green-600 py-3 rounded-xl font-semibold hover:bg-green-500 disabled:opacity-50 transition"
          >
            Confirm & Sign
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 Robust Transaction Broadcasting

### The Dropped Transactions Problem

Transactions on Solana can be "lost" due to:
- Network congestion
- Blockhash expiration
- RPC node issues

```typescript
// lib/send-transaction-robust.ts
import {
  Connection,
  Transaction,
  Keypair,
  SendTransactionError,
} from '@solana/web3.js';

interface SendOptions {
  maxRetries?: number;
  skipPreflight?: boolean;
  onStatus?: (status: string) => void;
}

export async function sendTransactionRobust(
  connection: Connection,
  transaction: Transaction,
  signers: Keypair[],
  options: SendOptions = {}
): Promise<string> {
  const { maxRetries = 5, onStatus } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      onStatus?.(`Attempt ${attempt + 1}/${maxRetries}: Getting blockhash...`);

      // Fresh blockhash for each try
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash('confirmed');

      transaction.recentBlockhash = blockhash;
      transaction.sign(...signers);

      onStatus?.('Sending transaction...');
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: options.skipPreflight ?? false,
          maxRetries: 0, // Manage retries manually
        }
      );

      onStatus?.('Waiting for confirmation...');

      // Wait for confirmation with timeout
      const result = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      );

      if (result.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(result.value.err)}`);
      }

      onStatus?.(`✅ Confirmed: ${signature}`);
      return signature;

    } catch (error: any) {
      lastError = error;

      // If blockhash expired — try again immediately
      if (error.message?.includes('Blockhash not found')) {
        onStatus?.('Blockhash expired, retrying...');
        continue;
      }

      // Exponential backoff for other errors
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        onStatus?.(`Error: ${error.message}. Waiting ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error('Transaction failed after max retries');
}
```

---

## 🚨 Professional Error Handling

### Solana Error Classification

```typescript
// lib/error-handler.ts

export type SolanaErrorType =
  | 'USER_REJECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'WALLET_NOT_CONNECTED'
  | 'NETWORK_ERROR'
  | 'PROGRAM_ERROR'
  | 'BLOCKHASH_EXPIRED'
  | 'UNKNOWN';

export interface SolanaError {
  type: SolanaErrorType;
  message: string;        // Technical message
  userMessage: string;    // Human-friendly message
  recoverable: boolean;   // Can retry?
}

export function parseSolanaError(error: any): SolanaError {
  const message = error?.message?.toLowerCase() ?? '';

  // User rejected
  if (message.includes('user rejected') || message.includes('cancelled')) {
    return {
      type: 'USER_REJECTED',
      message: error.message,
      userMessage: 'Transaction was cancelled',
      recoverable: true,
    };
  }

  // Insufficient SOL
  if (
    message.includes('insufficient funds') ||
    message.includes('0x1') // Lamport balance too low
  ) {
    return {
      type: 'INSUFFICIENT_FUNDS',
      message: error.message,
      userMessage: 'Insufficient SOL balance for this transaction',
      recoverable: false,
    };
  }

  // Wallet not connected
  if (message.includes('wallet not connected') || message.includes('not connected')) {
    return {
      type: 'WALLET_NOT_CONNECTED',
      message: error.message,
      userMessage: 'Please connect your wallet first',
      recoverable: true,
    };
  }

  // Blockhash expired
  if (message.includes('blockhash not found') || message.includes('expired')) {
    return {
      type: 'BLOCKHASH_EXPIRED',
      message: error.message,
      userMessage: 'Transaction expired. Please try again',
      recoverable: true,
    };
  }

  // Network error
  if (
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('timeout')
  ) {
    return {
      type: 'NETWORK_ERROR',
      message: error.message,
      userMessage: 'Network error. Check your internet connection',
      recoverable: true,
    };
  }

  // Program error
  if (message.includes('instruction error') || message.includes('custom program error')) {
    return {
      type: 'PROGRAM_ERROR',
      message: error.message,
      userMessage: 'Transaction failed. Please check the details and try again',
      recoverable: false,
    };
  }

  return {
    type: 'UNKNOWN',
    message: error.message ?? 'Unknown error',
    userMessage: 'Something went wrong. Please try again',
    recoverable: true,
  };
}
```

---

## 🔒 Production dApp Security

### Input Validation

```typescript
// lib/validators.ts
import { PublicKey } from '@solana/web3.js';

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function validateTransferInput(
  recipient: string,
  amount: string,
  balance: number
): { valid: boolean; error?: string } {
  if (!recipient) {
    return { valid: false, error: 'Recipient address is required' };
  }

  if (!isValidPublicKey(recipient)) {
    return { valid: false, error: 'Invalid Solana address' };
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return { valid: false, error: 'Invalid amount' };
  }

  const FEE_BUFFER = 0.001; // Buffer for fees
  if (amountNum + FEE_BUFFER > balance) {
    return {
      valid: false,
      error: `Insufficient balance. Max: ${(balance - FEE_BUFFER).toFixed(4)} SOL`,
    };
  }

  return { valid: true };
}
```

---

## 🚀 Mainnet Deployment

### Deployment Checklist

```typescript
// config/production.ts

export const PRODUCTION_CHECKLIST = {
  rpc: {
    ✅: 'Paid RPC provider (Helius/QuickNode)',
    ❌: 'api.mainnet-beta.solana.com (rate limited)',
  },

  security: {
    ✅: 'NEXT_PUBLIC_ vars contain no secrets',
    ✅: 'Smart contracts audited',
    ✅: 'Transaction simulation before send',
    ✅: 'Input validation on all forms',
  },

  ux: {
    ✅: 'Loading states on all async operations',
    ✅: 'User-friendly error messages',
    ✅: 'Explorer links on all transactions',
    ✅: 'Mobile-responsive design',
  },

  performance: {
    ✅: 'RPC batching implemented',
    ✅: 'React Query for caching',
    ✅: 'Lazy loading for heavy components',
    ✅: 'Bundle size analyzed (next-bundle-analyzer)',
  },
};
```

---

## 🎯 Course Summary

### What You've Mastered:

| Lecture | Skills |
|--------|--------|
| 1 | Accounts, Transactions, Programs, web3.js basics |
| 2 | Wallet Adapter, React hooks, UX patterns |
| 3 | SPL Tokens, NFTs, Anchor IDL, WebSockets |
| 4 | RPC optimization, Professional Error handling, Production deploy |

**Good luck at the hackathon! 🇺🇦🚀**
