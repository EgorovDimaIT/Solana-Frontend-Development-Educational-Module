# Lecture 2: Wallet Integration & Transaction Signing

## 🎯 Learning Objectives

After this lecture, you will be able to:
- Integrate wallets (Phantom, Solflare) into a React dApp
- Use the Solana Wallet Adapter libraries
- Develop a high-quality UX for connecting wallets and switching networks
- Sign various transaction types (SOL, Tokens, Messages)
- Handle common browser wallet errors

---

## 🔐 Why Not Private Keys?

On the frontend, we never handle user private keys directly. The user "trusts" their secret to a wallet application (browser extension). Your task is to ask the extension to sign data on the user's behalf.

In Solana, the standard for this is the **Solana Wallet Adapter**.

---

## 🏗️ Installing Dependencies

You will need three main libraries from Solana Labs:
```bash
npm install \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-phantom \
  @solana/wallet-adapter-solflare \
  @solana/web3.js
```

---

## 🛠️ Setting Up Providers (Context)

Around your `Layout` or `App` component:
- `ConnectionProvider`: Handles RPC connection.
- `WalletProvider`: Manages wallet state.
- `WalletModalProvider`: Provides the UI modal for wallet selection.

```tsx
// components/SolanaProvider.tsx
'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-phantom'; // Use individual adapters
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import modal styles!
import '@solana/wallet-adapter-react-ui/styles.css';

export const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

---

## ⚡ Core React Hooks

To interact with the wallet, use the `useWallet` hook.

```tsx
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletConnect() {
  const { publicKey, wallet, disconnect, connected } = useWallet();
  const { connection } = useConnection();

  if (!connected) return <WalletMultiButton />;

  return (
    <div>
      <p>Address: {publicKey?.toBase58()}</p>
      <button onClick={disconnect}>Logout</button>
    </div>
  );
}
```

---

## 💸 Sending a Transaction (Browser Sign)

In the browser, we build the transaction but don't sign it ourselves. We pass it to the wallet:

```tsx
const { publicKey, sendTransaction } = useWallet();
const { connection } = useConnection();

const handleTransfer = async () => {
  if (!publicKey) return;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipient,
      lamports: 1000000,
    })
  );

  // The wallet will sign and broadcast it!
  const signature = await sendTransaction(transaction, connection);
  
  // Wait for confirmation
  await connection.confirmTransaction(signature, 'processed');
};
```

---

## ✍️ Signing Messages (Off-chain Auth)

Often you need to prove wallet ownership without a transaction (e.g., for login).

```tsx
const { signMessage } = useWallet();

const handleAuth = async () => {
  if (!signMessage) return;

  const message = new TextEncoder().encode("dApp Login: " + Date.now());
  const signature = await signMessage(message);

  // Send signature and message to backend for verification
  console.log('Signed message:', signature);
};
```

---

## 🛡️ Handling Common Errors

1. `WalletNotConnectedError`: Prompt the user to connect their wallet.
2. `User rejected the request`: Error 4001 in Phantom. Always show "Transaction cancelled".
3. `Transaction simulation failed`: Error in parameters (insufficient SOL, invalid recipient).
4. `Blockhash not found`: Expired hash (try rebuilding the transaction).

```tsx
try {
  const sig = await sendTransaction(tx, connection);
} catch (e: any) {
  if (e.message.indexOf('User rejected') !== -1) {
    toast.error('You cancelled the transaction!');
  } else {
    toast.error('Error: ' + e.message);
  }
}
```

---

## 🎨 UX Best Practices

- **Connect Button**: Always use `WalletMultiButton` with its default behavior.
- **Network Check**: Verify that the wallet is connected to the correct network (Mainnet/Devnet).
- **Loading State**: Disable the button while waiting for "Signature Confirmation".
- **Explorer Links**: Always provide a link to the transaction in an explorer after success.

---

## 🛠️ Practice Task

1. Create a React page with a `WalletConnect` button.
2. Display the balance of the connected wallet.
3. Implement a form to send a custom amount of SOL to another address.
4. Add a check: if the balance is insufficient, prevent clicking "Send".
