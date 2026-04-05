# Lecture 3: Reading & Writing On-Chain Data

## 🎯 Learning Objectives

After this lecture, you will be able to:
- Read SPL Token and NFT data
- Deserialize Anchor account data
- Use Anchor IDL for type-safe interactions
- Subscribe to real-time account updates

---

## 📦 SPL Token Program

### What is an SPL Token?

SPL Token is the standard for fungible tokens on Solana, similar to ERC-20 on Ethereum. Each token has:

```
Mint Account (Token definition)
├── supply           → Total supply
├── decimals         → Decimal places (6 = 1.000000)
├── mintAuthority    → Who can mint new tokens
└── freezeAuthority  → Who can freeze accounts

Token Account (Stores specific user balance)
├── mint    → Reference to Mint Account
├── owner   → Token owner
├── amount  → Balance in smallest units
└── state   → initialized | frozen
```

### Reading Token Information

```typescript
import {
  getMint,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

// Get Mint info (token description)
async function getTokenInfo(mintAddress: string) {
  const mint = await getMint(
    connection,
    new PublicKey(mintAddress)
  );

  return {
    supply: mint.supply.toString(),
    decimals: mint.decimals,
    mintAuthority: mint.mintAuthority?.toBase58(),
    freezeAuthority: mint.freezeAuthority?.toBase58(),
  };
}

// Get token balance for a user
async function getTokenBalance(
  walletAddress: string,
  mintAddress: string
) {
  const wallet = new PublicKey(walletAddress);
  const mint = new PublicKey(mintAddress);

  // Associated Token Account — standard address for storing tokens
  const ata = await getAssociatedTokenAddress(mint, wallet);

  try {
    const tokenAccount = await getAccount(connection, ata);

    return {
      address: ata.toBase58(),
      amount: tokenAccount.amount.toString(),
      // Readable balance considering decimals
      uiAmount: Number(tokenAccount.amount) / Math.pow(10, 6),
      owner: tokenAccount.owner.toBase58(),
    };
  } catch {
    return null; // Account doesn't exist
  }
}
```

### Getting All Wallet Tokens

```typescript
async function getAllTokenAccounts(walletAddress: string) {
  const wallet = new PublicKey(walletAddress);

  // Get all token accounts with one request
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    wallet,
    { programId: TOKEN_PROGRAM_ID }
  );

  return tokenAccounts.value
    .map(({ account }) => {
      const info = account.data.parsed.info;
      return {
        mint: info.mint,
        balance: info.tokenAmount.uiAmount,
        decimals: info.tokenAmount.decimals,
        address: account.owner.toBase58(),
      };
    })
    .filter(t => t.balance > 0); // Non-zero balances only
}
```

---

## 🖼️ NFT and Metadata

### NFT Structure on Solana

```
NFT Mint Account (supply = 1, decimals = 0)
    │
    └─► Metadata Account (Metaplex)
            ├── name: "My NFT #1"
            ├── symbol: "NFT"
            ├── uri: "https://arweave.net/..."  → JSON
            │         ├── name
            │         ├── description
            │         ├── image: "https://..."
            │         └── attributes: [...]
            ├── creators: [...]
            └── sellerFeeBasisPoints: 500 (5%)
```

### Reading NFT Metadata

```typescript
import { Metaplex } from '@metaplex-foundation/js';

const metaplex = Metaplex.make(connection);

// Get single NFT
async function getNFT(mintAddress: string) {
  const nft = await metaplex
    .nfts()
    .findByMint({ mintAddress: new PublicKey(mintAddress) });

  return {
    name: nft.name,
    symbol: nft.symbol,
    uri: nft.uri,
    image: nft.json?.image,
    attributes: nft.json?.attributes,
    creators: nft.creators,
    royalty: nft.sellerFeeBasisPoints / 100 + '%',
  };
}

// Get all wallet NFTs
async function getWalletNFTs(walletAddress: string) {
  const nfts = await metaplex
    .nfts()
    .findAllByOwner({ owner: new PublicKey(walletAddress) });

  // Load metadata for each NFT
  const withMetadata = await Promise.all(
    nfts.map(async (nft) => {
      if (!nft.json) {
        await metaplex.nfts().load({ metadata: nft as any });
      }
      return nft;
    })
  );

  return withMetadata;
}
```

---

## ⚓ Anchor IDL and Data Deserialization

### What is Anchor IDL?

IDL (Interface Definition Language) is a JSON description of your smart contract. Like Swagger/OpenAPI for REST APIs, but for the blockchain.

```json
{
  "version": "0.1.0",
  "name": "my_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [...],
      "args": [
        { "name": "value", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "MyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "value", "type": "u64" },
          { "name": "owner", "type": "publicKey" }
        ]
      }
    }
  ]
}
```

### Using Anchor on Frontend

```typescript
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import idl from './my_program.json';

// Program ID
const PROGRAM_ID = new web3.PublicKey('YourProgramIdHere11111111111111111111111111');

// Hook for interacting with the program
function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet.publicKey) return null;

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    return new Program(idl as any, PROGRAM_ID, provider);
  }, [connection, wallet.publicKey]);

  return program;
}

// Fetching account data
async function fetchAccountData(program: Program, accountAddress: string) {
  // Anchor automatically deserializes the data!
  const account = await program.account.myAccount.fetch(
    new web3.PublicKey(accountAddress)
  );

  return {
    value: account.value.toNumber(),  // BN → number
    owner: account.owner.toBase58(),
  };
}

// Calling an instruction
async function callInstruction(program: Program, value: number) {
  const [accountPda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('account'), program.provider.publicKey.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .initialize(new BN(value))  // Pass arguments
    .accounts({
      account: accountPda,
      user: program.provider.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();

  console.log('Transaction:', tx);
  return tx;
}
```

---

## 🔔 Real-time Updates (WebSocket)

### Account Subscription

```typescript
function useAccountSubscription(accountAddress: string) {
  const { connection } = useConnection();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!accountAddress) return;

    const pubkey = new PublicKey(accountAddress);

    // Initial load
    connection.getAccountInfo(pubkey).then(setData);

    // Subscribe to changes (WebSocket)
    const subscriptionId = connection.onAccountChange(
      pubkey,
      (accountInfo) => {
        console.log('Account updated!', accountInfo);
        setData(accountInfo);
      },
      'confirmed'
    );

    // Cleanup on unmount
    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [accountAddress, connection]);

  return data;
}
```

### Program Logs Subscription

```typescript
function useProgramLogs(programId: string) {
  const { connection } = useConnection();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const subId = connection.onLogs(
      new PublicKey(programId),
      ({ logs, err, signature }) => {
        if (!err) {
          console.log('New transaction:', signature);
          setLogs(prev => [...prev.slice(-50), ...logs]);
        }
      },
      'confirmed'
    );

    return () => {
      connection.removeOnLogsListener(subId);
    };
  }, [programId]);

  return logs;
}
```

---

## 📊 Practical Example: NFT Gallery

```typescript
// components/NFTGallery.tsx
'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Metaplex } from '@metaplex-foundation/js';

interface NFTItem {
  mint: string;
  name: string;
  image: string;
  collection?: string;
}

export function NFTGallery() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    loadNFTs();
  }, [publicKey]);

  async function loadNFTs() {
    if (!publicKey) return;
    setLoading(true);

    const metaplex = Metaplex.make(connection);

    // Fetch all wallet NFTs
    const allNFTs = await metaplex
      .nfts()
      .findAllByOwner({ owner: publicKey });

    // Load metadata in parallel (batches)
    const BATCH_SIZE = 5;
    const results: NFTItem[] = [];

    for (let i = 0; i < allNFTs.length; i += BATCH_SIZE) {
      const batch = allNFTs.slice(i, i + BATCH_SIZE);
      const loaded = await Promise.all(
        batch.map(async (nft) => {
          try {
            const loaded = await metaplex.nfts().load({ metadata: nft as any });
            return {
              mint: loaded.address.toBase58(),
              name: loaded.name,
              image: loaded.json?.image || '',
              collection: loaded.collection?.address.toBase58(),
            };
          } catch {
            return null;
          }
        })
      );
      results.push(...loaded.filter(Boolean) as NFTItem[]);
    }

    setNfts(results);
    setLoading(false);
  }

  if (!publicKey) {
    return <p>Connect wallet to view NFTs</p>;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 rounded-xl aspect-square" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Your NFTs ({nfts.length})
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {nfts.map(nft => (
          <div key={nft.mint} className="bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{nft.name}</p>
              <p className="text-gray-400 text-xs font-mono">
                {nft.mint.slice(0, 8)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ⚡ Request Optimization

### Batching Requests

```typescript
// ❌ Slow — 100 individual requests
for (const address of addresses) {
  const balance = await connection.getBalance(new PublicKey(address));
}

// ✅ Fast — one request
const accountInfos = await connection.getMultipleAccountsInfo(
  addresses.map(a => new PublicKey(a))
);
```

### Caching with React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function useTokenBalance(walletAddress: string, mintAddress: string) {
  return useQuery({
    queryKey: ['tokenBalance', walletAddress, mintAddress],
    queryFn: () => getTokenBalance(walletAddress, mintAddress),
    staleTime: 30_000,     // Cache for 30 seconds
    refetchInterval: 60_000, // Refresh every minute
  });
}

// In component:
const { data: balance, isLoading } = useTokenBalance(
  wallet.toBase58(),
  USDC_MINT
);
```

---

## 🎯 Summary

You learned:
- ✅ Reading SPL Token data
- ✅ Fetching NFTs and their metadata
- ✅ Using Anchor IDL for type-safety
- ✅ Subscribing to real-time updates
- ✅ Optimizing requests (batching, caching)

---

## 🛠️ Practice Task

1. **Token Scanner**: Create a script that lists all SPL tokens in a given wallet.
2. **Real-time Tracker**: Implement a WebSocket listener that logs every time a specific Mint address is used in a transaction.
3. **Anchor Fetcher**: Find a public Anchor program (like a DAO or Game), find its IDL, and write a script to fetch one of its global state accounts.

---

**Next Lecture:** Production-Ready dApp — deployment, optimization, and security! 🚀

---

## 📚 Resources

- [SPL Token Docs](https://spl.solana.com/token)
- [Metaplex JS SDK](https://github.com/metaplex-foundation/js)
- [Anchor Book](https://www.anchor-lang.com/)
- [React Query](https://tanstack.com/query)
