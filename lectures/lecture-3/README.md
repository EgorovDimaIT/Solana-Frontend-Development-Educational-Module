# 📖 ЛЕКЦИЯ 3: READING & WRITING ON-CHAIN DATA (TOKENS & NFT)

🎯 **Цель:** Научиться работать с SPL токенами, десериализовать данные аккаунтов и извлекать метаданные NFT.

---

## 📊 Презентация (Google Slides Structure)
1. **Introduction to On-Chain Data**: Understanding that data is just bytes.
2. **The SPL Token Program**: How tokens work on Solana.
3. **Associated Token Accounts (ATA)**: Why tokens need a special account.
4. **Fetching Token Balances**: Using `getTokenAccountsByOwner`.
5. **Introduction to Metaplex**: Standards for NFTs on Solana.
6. **MPX SDK**: Reading NFT metadata (URI, Name, Image).
7. **Decoding Account Data**: Using `Borsh` and `AccountLayout`.
8. **PDA (Program Derived Addresses)**: Why we need "virtual" accounts.
9. **Fetching Multiple Accounts**: Using `getMultipleAccountsInfo` (batching).
10. **Writing Data**: Creating non-transfer instructions.
11. **Filtering Data**: Using `memcmp` and `dataSize`.
12. **The "Everything is an Account" mindset**.

---

## 💻 Starter Kit (NFT Gallery)
📦 [lecture-3-nft-gallery](../../starter-kits/lecture-3-starter)

---

## 🔨 Практическое задание 3: "NFT Gallery dApp"
Создайте приложение, которое подключает кошелек и отображает все NFT пользователя в красивой сетке (Галлерея).
1. Получите список всех токенов кошелька.
2. Отфильтруйте NFT (токены с supply=1).
3. Используйте Metaplex SDK для получения метаданных (URI, Image).
4. Отобразите карточки NFT с названием и описанием.

### Бонус (+20%):
- Отображение атрибутов NFT.
- Фильтрация по коллекции.

---

## 📝 Тест (Quiz)
1. Что такое ATA? (Associated Token Account)
2. Какой стандарт используется для NFT? (Metaplex)
3. Что такое PDA? (Account without private key, derived from seeds)
4. Зачем нужен Borsh? (Binary Serialization/Deserialization)
...
