# 🎓 ЛЕКЦИЯ 3: READING & WRITING ON-CHAIN DATA

### 📊 Слайды (Структура презентации)

```markdown
СЛАЙД 1: On-Chain Data Deep Dive
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Beyond Balance: NFTs, Tokens, and Data

Today's Goal:
• Learn how Solana stores data
• Fetch NFT metadata 
• Understand Token Program
• Build a Dynamic Gallery

СЛАЙД 2: The Data Model
━━━━━━━━━━━━━━━━━━━━━
Solana Account {
  data: Buffer, // The "Meat"
  owner: ProgramID,
  executable: boolean,
  lamports: number
}

"Everything is an Account"

СЛАЙД 3: Serialization/Deserialization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Solana stores data as RAW BYTES (Buffer).

Web2: JSON.parse(str)
Web3: Schema.decode(buffer) // Using Borsh or Anchor

Frontend devs: You need a SCHEMA to read data!

СЛАЙД 4: The Token Program
━━━━━━━━━━━━━━━━━━━━━━━
Mint Account: Defines the token (e.g. USDC)
Token Account: Holds YOUR balance of that token

Math: 
User Wallet -> holds multiple Token Accounts
Token Account -> belongs to ONE Mint

СЛАЙД 5: Introduction to Metaplex
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Solana tokens don't have "Images" inside.
Solution: Metaplex Standard.

Token + Metadata Account (URI) = NFT

СЛАЙД 6: The Metaplex JS SDK
━━━━━━━━━━━━━━━━━━━━━━━━━
npm install @metaplex-foundation/js

const metaplex = Metaplex.make(connection)
  .use(walletAdapterIdentity(wallet));

const nft = await metaplex.nfts().findByMint({ mintAddress });

СЛАЙД 7: Fetching All User NFTs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const nfts = await metaplex.nfts()
  .findAllByOwner({ owner: publicKey });

// Return list of metadata objects
// includes: name, symbol, uri

СЛАЙД 8: PDAs (Program Derived Addresses)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Addresses without a private key.
Controlled by programs.

Use case: Metadata accounts, Vaults.
Frontend logic: `PublicKey.findProgramAddressSync(...)`

СЛАЙД 9: Reading SPL Tokens (web3.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { 
  getOrCreateAssociatedTokenAccount 
} from '@solana/spl-token';

Fetch balance, transfer tokens, close accounts.

СЛАЙД 10: Performance: getProgramAccounts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fetch MANY accounts in one call.
Warning: HEAVY query. 
Frontend tip: Use filters (memcmp) to only get what you need.

СЛАЙД 11: Real-time UI: onAccountChange
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
connection.onAccountChange(
  publicKey,
  (accountInfo) => {
    // Update balance/data instantly 
    // without refreshing!
  }
);

СЛАЙД 12: Building the NFT Gallery
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Connect Wallet
2. Metaplex.findAllByOwner
3. Map results to Card components
4. Lazy load images from URI (IPFS/Arweave)

Let's open the starter kit! 🚀
```

### 💻 Стартовый набор кода
Находится в `starter-kits/lecture-3-starter`

### 🔨 Практическое задание
**"NFT Museum dApp"**
1. ✅ Загрузка всех NFT пользователя
2. ✅ Отображение картинок и имен
3. ✅ Фильтр по коллекции
4. ✅ Кнопка "View on Explorer" для каждого ассета
5. ✅ Кэширование данных (localStorage)

### 📝 Тест
Находится в `quizzes/quiz-3.md`
