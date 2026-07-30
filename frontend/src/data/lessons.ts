export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string; // Markdown content
  questions: Question[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Arc",
    description: "Discover the fundamentals of the Arc L1 blockchain, its consensus mechanism, and why it's built for scale.",
    content: `
# Module 1: Introduction to the Arc L1 Blockchain

Welcome to **ARCademy**. In this foundational module, you will gain an in-depth understanding of the Arc L1 architecture, its genesis, technical innovation, and how it tackles the central bottlenecks of modern decentralized networks.

---

## 1. The Blockchain Trilemma & Arc's Core Philosophy

For over a decade, computer scientists and cryptographers have grappled with Vitalik Buterin's **Blockchain Trilemma**: the assertion that a decentralized network can simultaneously maximize only two out of three core properties—**Scalability**, **Security**, and **Decentralization**.

- **Ethereum Mainnet**: Prioritizes extreme decentralization and security at the cost of high gas fees and limited throughput (~15-30 transactions per second).
- **Legacy Layer 2s**: Offer higher throughput by batching transactions off-chain, but introduce bridging risks, sequence centralization, and fragmentation of liquidity.
- **Arc L1**: Engineered from first principles as an autonomous, high-throughput Layer 1 protocol that eliminates the need for L2 fragmentation while maintaining sub-second deterministic finality.

![Architecture Diagram](https://images.unsplash.com/photo-1639762681485-074b7f4d238d?auto=format&fit=crop&q=80&w=1000)

---

## 2. Core Architecture & Consensus Engine

Arc operates on a proprietary consensus mechanism known as **Proof of Authority & Stake (PoAS)**. PoAS combines the validator economic alignment of Proof of Stake with the high-speed block proposer routing of Proof of Authority.

### Key Technical Parameters

| Parameter | Arc L1 Specification | Traditional L1 Standard |
| :--- | :--- | :--- |
| **Block Time** | **<800 Milliseconds** | 12 - 15 Seconds |
| **Finality Mode** | **Deterministic Single-Slot** | Probabilistic (12+ blocks) |
| **Average Gas Fee** | **<$0.0001 USD** | $1.50 - $45.00 USD |
| **Execution Engine** | **Optimized EVM Bytecode** | Standard EVM / WASM |

### How PoAS Works Under the Hood

1. **Validator Staking**: Nodes stake native ARC tokens to become eligible block proposers.
2. **Authority Rotation**: High-reputation validator committees are dynamically selected per epoch to propose and validate state transitions.
3. **Pipelined Block Production**: While Block N is being executed by worker threads, Block N+1 consensus is already being reached in parallel.

---

## 3. Developer & Enterprise Advantages

Arc L1 is designed to be **100% EVM Compatible**. This means developers do not need to learn custom smart contract languages like Rust or Move; all standard Solidity, Vyper, and Yul smart contracts run natively without modification.

\`\`\`javascript
// Example: Interacting with Arc L1 using Ethers.js v6
import { ethers } from "ethers";

const ARC_RPC_URL = "https://rpc.arc.network";
const provider = new ethers.JsonRpcProvider(ARC_RPC_URL);

async function inspectNetworkState() {
  const blockNumber = await provider.getBlockNumber();
  const feeData = await provider.getFeeData();
  
  console.log(\`Current Arc L1 Block Height: \${blockNumber}\`);
  console.log(\`Base Gas Fee: \${ethers.formatUnits(feeData.gasPrice || 0n, 'gwei')} Gwei\`);
}

inspectNetworkState();
\`\`\`

---

## 4. Summary & Takeaways

- Arc L1 eliminates the traditional trade-offs of legacy blockchains via **Proof of Authority & Stake (PoAS)**.
- Achieving **sub-second finality (<800ms)** and **near-zero gas fees (<$0.0001)** unlocks new Web3 business models like micro-transactions and real-time gaming.
- Full EVM compatibility guarantees seamless portability for existing Ethereum smart contracts and tooling.
`,
    questions: [
      {
        id: 101,
        text: "What consensus mechanism does Arc L1 use?",
        options: ["Proof of Work (PoW)", "Proof of Authority & Stake (PoAS)", "Delegated Proof of Stake (DPoS)", "Proof of History (PoH)"],
        correctAnswerIndex: 1
      },
      {
        id: 102,
        text: "What is the average block finality time on Arc?",
        options: ["10 minutes", "Under 800 milliseconds", "12 seconds", "1 hour"],
        correctAnswerIndex: 1
      },
      {
        id: 103,
        text: "Is Arc L1 compatible with the Ethereum Virtual Machine (EVM)?",
        options: ["No, it uses WASM", "Yes, it is fully EVM compatible", "Only for read operations", "Only on testnet"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 2,
    title: "Understanding Stablecoins",
    description: "Learn the mechanics behind stablecoins, algorithmic vs. fiat-backed, and their role in Web3.",
    content: `
# Module 2: The Mechanics of Stablecoins

In this lesson, we explore the macroeconomic and technical engineering behind **Stablecoins**—the cryptographic bridges linking volatile Web3 markets to the global financial banking system.

---

## 1. Why Price Volatility Inhibits Global Adoption

Native cryptocurrencies like Bitcoin (BTC) and Ether (ETH) fluctuate based on supply, demand, market sentiment, and global liquidity. While volatility is desirable for speculative trading, it creates significant friction for everyday commerce:

- **Payroll**: Paying software engineers in an asset that swings ±15% week-over-week makes personal budgeting unpredictable.
- **Invoicing**: A $10,000 corporate invoice paid in a volatile asset might crash to $8,000 before the recipient can liquidate it to cash.
- **Accounting**: Tax reporting requires static fiat unit-of-account tracking.

Stablecoins resolve these issues by anchoring their token valuation directly to a sovereign fiat currency, typically the **United States Dollar (USD)**.

---

## 2. Taxonomy of Stablecoin Architecture

Stablecoins are broadly categorized into three distinct architectural models, each balancing risk, collateralization, and decentralization differently.

![Stablecoin Collateral Models](https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1000)

### A. Fiat-Collateralized (Off-Chain Reserves)
- **Examples**: USD Coin (USDC), Tether (USDT).
- **Mechanism**: A centralized entity holds physical USD or short-term US Treasury Bills in audited commercial bank reserves.
- **Mint/Burn Ratio**: $1.00 Physical USD deposited → $1.00 Digital Token minted.
- **Risk**: Counterparty, regulatory, and banking system risk.

### B. Crypto-Collateralized (On-Chain Reserves)
- **Examples**: DAI (MakerDAO / Sky).
- **Mechanism**: Users lock up crypto collateral (e.g., ETH) inside smart contract vaults to mint stablecoins.
- **Over-Collateralization**: Because crypto assets are volatile, vaults require $>140\%$ collateralization to prevent insolvency during price drops.

### C. Algorithmic (Uncollateralized)
- **Examples**: TerraUSD (UST - Historical).
- **Mechanism**: Relies on dual-token arbitrage loops to dynamically burn and mint assets to maintain a $1.00 peg.
- **Risk**: Extremely high risk of "death spirals" when market confidence falters.

---

## 3. Stablecoin Smart Contract Interfaces

On EVM chains like Arc L1, stablecoins are implemented as standard **ERC20** tokens. Here is a Solidity interface showing how smart contracts query balances and transfer stablecoins:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Stablecoin {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}
\`\`\`

---

## 4. Key Takeaways

- Stablecoins provide a stable unit of account required for payroll, invoicing, and commercial Web3 services.
- **Fiat-backed stablecoins** provide the highest price stability by backing digital tokens 1:1 with real-world bank reserves.
- On EVM chains, stablecoins operate using standard **ERC20 smart contract token interfaces**.
`,
    questions: [
      {
        id: 201,
        text: "Which type of stablecoin is backed 1:1 by traditional money in a bank?",
        options: ["Algorithmic", "Fiat-Collateralized", "Crypto-Collateralized", "NFT-backed"],
        correctAnswerIndex: 1
      },
      {
        id: 202,
        text: "Why are stablecoins important for daily commerce?",
        options: ["They increase in value quickly", "They are highly volatile", "They provide predictable accounting and value storage", "They consume more electricity"],
        correctAnswerIndex: 2
      },
      {
        id: 203,
        text: "Technically, what standard do most stablecoins on EVM networks use?",
        options: ["ERC721", "ERC1155", "ERC20", "Bitcoin Script"],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    id: 3,
    title: "USDC Fundamentals",
    description: "Deep dive into USD Coin (USDC), its smart contract architecture, and why it's the standard on Arc L1.",
    content: `
# Module 3: Deep Dive into USDC (USD Coin)

USD Coin (**USDC**), issued by **Circle**, represents the premier enterprise-grade stablecoin in Web3. In this module, we examine the smart contract implementation of USDC, its 6-decimal standard, and native integration on Arc L1.

---

## 1. Corporate Governance & Reserve Auditability

Unlike unregulated stablecoins, USDC operates under strict financial regulatory oversight in the United States and global financial centers:

- **Reserve Backing**: 100% backed by cash and short-duration US Treasuries managed inside the Circle Reserve Fund (audited monthly by Deloitte).
- **Native Issuance**: Arc L1 features native issuance of USDC, eliminating synthetic wrapped-token vulnerabilities.

---

## 2. Technical Special Case: 6 Decimals vs 18 Decimals

A standard ERC20 token on Ethereum typically uses **18 decimal places** (matching $1 \text{ ETH} = 10^{18} \text{ wei}$). However, **USDC uses 6 decimal places** ($1 \text{ USDC} = 10^{6} \text{ units}$).

> [!WARNING]
> **Developer Pitfall**: Passing $1,000,000$ units to a USDC contract represents **$1.00 USD**, NOT $1,000,000 USD$! Always calculate USDC amounts using $10^6$.

\`\`\`typescript
import { ethers } from "ethers";

// Converting human-readable USD to contract units
const oneDollar = ethers.parseUnits("1.00", 6); // Returns 1000000n BigInt
const oneHundredDollars = ethers.parseUnits("100.00", 6); // Returns 100000000n BigInt

console.log("1 USD in USDC contract units:", oneDollar.toString());
\`\`\`

---

## 3. Proxy Architecture & Upgradability

The USDC contract deployed on EVM chains utilizes an **Admin Upgradeability Proxy** pattern. This allows Circle to upgrade contract logic (such as gas optimizations or regulatory compliance features) without changing the underlying token address or user balances.

\`\`\`
[ User / Developer Application ]
              │
              ▼
    [ Proxy Contract (0xUSDC...) ] ──( delegatecall )──► [ Implementation Contract ]
\`\`\`

---

## 4. Key Takeaways

- USDC is natively supported on Arc L1, removing cross-chain bridge risks.
- **USDC uses 6 decimal places**, unlike standard 18-decimal tokens.
- USDC utilizes an **Upgradable Proxy Contract Architecture** managed by Circle.
`,
    questions: [
      {
        id: 301,
        text: "How many decimal places does the USDC token use?",
        options: ["18", "8", "6", "0"],
        correctAnswerIndex: 2
      },
      {
        id: 302,
        text: "What does 'Native USDC' on Arc L1 mean?",
        options: ["It is issued directly on Arc, avoiding bridging risks", "It was bridged from Solana", "It is an algorithmic clone", "It can only be used by developers"],
        correctAnswerIndex: 0
      },
      {
        id: 303,
        text: "Can a specific wallet address be frozen from using its USDC?",
        options: ["No, it is mathematically impossible", "Yes, via the blacklist function in the smart contract", "Only if the user deletes their private key", "Only if the network is shut down"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 4,
    title: "Wallets and Accounts",
    description: "Learn how public/private key cryptography secures your assets, and explore embedded wallets like Privy.",
    content: `
# Module 4: Cryptographic Accounts & Embedded Wallets

In this module, we dissect public/private key cryptography, compare Externally Owned Accounts (EOAs) with Smart Contract Accounts, and analyze how **Privy embedded wallets** revolutionize Web3 user onboarding.

---

## 1. Asymmetric Cryptography Essentials

All blockchain accounts rely on **Elliptic Curve Cryptography (secp256k1)**:

1. **Private Key**: A randomly generated 256-bit scalar integer.
2. **Public Key**: Derived deterministically from the private key via elliptic curve multiplication ($P = k \times G$).
3. **Address**: The last 20 bytes of the Keccak-256 hash of the public key, prefixed with \`0x\`.

---

## 2. EOA vs Smart Contract Accounts

| Feature | Externally Owned Account (EOA) | Smart Contract Account (ERC-4337) |
| :--- | :--- | :--- |
| **Control** | Private Key / Seed Phrase | Programmable Solidity Code |
| **Can Initiate Tx?** | Yes | Yes (via UserOperations) |
| **Key Recovery** | Impossible if seed lost | Social Recovery & Multi-sig |
| **Gas Payment** | Native gas tokens only | Gas Sponsorship (Paymasters) |

---

## 3. Embedded Wallets via Privy

Rather than forcing non-technical users to manage 12-word seed phrases, **Privy** utilizes **Multi-Party Computation (MPC)**. The private key is split into encrypted shares divided between the user's browser, Privy's secure enclaves, and an independent key custodian.

\`\`\`tsx
import { usePrivy, useWallets } from '@privy-io/react-auth';

export function UserWalletCard() {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  if (!authenticated) {
    return <button onClick={login}>Sign In with Email</button>;
  }

  return (
    <div>
      <p>Embedded Wallet Address: {wallets[0]?.address}</p>
    </div>
  );
}
\`\`\`

---

## 4. Key Takeaways

- Private keys sign transactions; public addresses identify recipient destinations.
- **Embedded wallets** use MPC cryptography to enable seamless email login without compromising security.
`,
    questions: [
      {
        id: 401,
        text: "What is the primary purpose of a Private Key?",
        options: ["To share with friends to receive funds", "To mathematically sign and authorize transactions", "To act as a username on block explorers", "To encrypt emails"],
        correctAnswerIndex: 1
      },
      {
        id: 402,
        text: "What is an Externally Owned Account (EOA)?",
        options: ["An account controlled by a smart contract", "An account on a centralized exchange", "An account controlled by a private key", "An account that cannot hold tokens"],
        correctAnswerIndex: 2
      },
      {
        id: 403,
        text: "How do embedded wallets like Privy improve user onboarding?",
        options: ["They make the user write down a 24-word phrase instead of 12", "They allow users to login via email/socials while abstracting away the private key management", "They give users free Bitcoin", "They force users to download a mobile app"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 5,
    title: "Transactions",
    description: "Understand the lifecycle of a blockchain transaction, from signing to inclusion in a block.",
    content: `
# Module 5: Transaction Mechanics & Execution Lifecycle

This module breaks down the anatomy of an EVM transaction on Arc L1, tracing how signed payloads travel from the client application through the Mempool into confirmed blocks.

---

## 1. Anatomy of an EVM Transaction Payload

An EVM transaction is an RLP (Recursive Length Prefix) encoded data structure containing the following mandatory fields:

- \`nonce\`: Sequential transaction counter for the sender address. Prevents replay attacks.
- \`to\`: Target recipient address (or \`null\` if deploying a new smart contract).
- \`value\`: Amount of native tokens to transfer in wei.
- \`data\`: Compiled ABI payload containing function selectors and arguments.
- \`gasLimit\`: Maximum computational gas units allowed.
- \`v, r, s\`: Cryptographic ECDSA signature components.

---

## 2. Transaction Lifecycle Phases

1. **Client Signing**: The user authorizes the transaction payload using their private key.
2. **RPC Dispatch**: The client sends the raw signed hex string to an Arc L1 RPC node.
3. **Mempool Staging**: RPC nodes validate signature integrity and place the payload into the transaction mempool.
4. **Block Validation & Execution**: Validator nodes execute the state transition on their local EVM state.
5. **Block Inclusion**: The transaction is sealed inside a block in **<800ms**.

---

## 3. Key Takeaways

- Nonce enforces strict sequential transaction execution order per wallet.
- \`data\` field carries compiled ABI function calls for smart contract interactions.
`,
    questions: [
      {
        id: 501,
        text: "What is the Mempool?",
        options: ["A pool of liquid tokens", "The waiting area for pending, unconfirmed transactions", "A type of smart contract", "A database of user passwords"],
        correctAnswerIndex: 1
      },
      {
        id: 502,
        text: "What is the purpose of the 'nonce' in a transaction?",
        options: ["To encrypt the data", "To specify the gas price", "To prevent replay attacks by ensuring strict ordering", "To identify the receiver"],
        correctAnswerIndex: 2
      },
      {
        id: 503,
        text: "What goes inside the 'data' field of a transaction?",
        options: ["The user's private key", "Compiled bytecode instructions for smart contract interaction", "An image file", "The transaction hash"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 6,
    title: "Smart Contracts",
    description: "Write and understand Solidity smart contracts. The programmable money layer of Web3.",
    content: `
# Module 6: Solidity Programming & EVM Mechanics

Smart contracts are deterministic, immutable computer programs executed across decentralized nodes. In this module, we examine Solidity contract syntax, state variables, and execution mechanics.

---

## 1. Solidity Basics

Solidity is a statically typed, contract-oriented language designed for compiling code into EVM bytecode.

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 private count;
    address public owner;

    event Incremented(uint256 newCount);

    constructor() {
        owner = msg.sender;
    }

    function increment() external {
        count += 1;
        emit Incremented(count);
    }

    function getCount() external view returns (uint256) {
        return count;
    }
}
\`\`\`

---

## 2. Read vs Write Functions

- **View / Pure Functions**: Read data from state without modifying it. They cost zero gas when called off-chain.
- **State-Changing Functions**: Modify state variables on-chain. Requires gas and transaction signing.

---

## 3. Key Takeaways

- Deployed smart contract bytecode is **immutable**.
- Reading contract state via \`view\` functions is free; writing state requires gas.
`,
    questions: [
      {
        id: 601,
        text: "What does 'immutable' mean in the context of a deployed smart contract?",
        options: ["It can be paused by the owner", "Its source code cannot be modified after deployment", "It cannot receive tokens", "It runs forever without gas"],
        correctAnswerIndex: 1
      },
      {
        id: 602,
        text: "Which programming language is most commonly used to write EVM smart contracts?",
        options: ["Rust", "Python", "Solidity", "Java"],
        correctAnswerIndex: 2
      },
      {
        id: 603,
        text: "Does calling a 'view' function cost gas?",
        options: ["Yes, always", "No, reading state is free", "Only on Ethereum, not on Arc", "Yes, but it's refunded"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 7,
    title: "Escrow",
    description: "Learn how trustless escrow works using smart contracts to protect buyers and sellers.",
    content: `
# Module 7: Trustless Escrow Systems

Escrow contracts act as impartial automated arbiters, locking funds until pre-specified contract conditions are verified on-chain.

---

## 1. Escrow Architecture

Traditional escrow depends on banks or escrow attorneys. Smart contract escrows remove human bias entirely.

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleEscrow {
    address public buyer;
    address public seller;
    uint256 public amount;

    enum State { Created, Locked, Release, Refunded }
    State public state;

    constructor(address _seller) payable {
        buyer = msg.sender;
        seller = _seller;
        amount = msg.value;
        state = State.Locked;
    }

    function confirmDelivery() external {
        require(msg.sender == buyer, "Only buyer");
        require(state == State.Locked, "Invalid state");
        state = State.Release;
        payable(seller).transfer(amount);
    }
}
\`\`\`

---

## 2. Key Takeaways

- Smart contract escrows eliminate middleman fees and counterparty risk.
`,
    questions: [
      {
        id: 701,
        text: "What replaces the trusted third-party (e.g., bank) in a Web3 escrow?",
        options: ["A centralized exchange", "A Smart Contract", "The government", "The miner/validator"],
        correctAnswerIndex: 1
      },
      {
        id: 702,
        text: "What happens if a smart contract escrow receives conflicting commands not programmed into it?",
        options: ["It executes them anyway", "It guesses what the user wanted", "It throws an error and reverts the transaction", "It asks the arbiter for new code"],
        correctAnswerIndex: 2
      },
      {
        id: 703,
        text: "Why is a decentralized escrow superior to a traditional one?",
        options: ["It requires physical paperwork", "It is impartial, transparent, and has near-zero overhead", "It can be bribed by the buyer", "It takes weeks to process"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 8,
    title: "Privacy",
    description: "Explore the balance between transparency and privacy on public blockchains using ZK proofs.",
    content: `
# Module 8: Zero-Knowledge Proofs & On-Chain Privacy

This module covers privacy challenges on public ledgers and how **Zero-Knowledge Proofs (ZKPs)** enable verifiable computations without exposing underlying private data.

---

## 1. Zero-Knowledge Cryptography

A ZKP enables a prover to demonstrate to a verifier that a statement is mathematically true without disclosing any secret inputs.

- **ZK-SNARKs**: Succinct Non-Interactive Arguments of Knowledge.
- **Applications**: Private financial transactions, selective KYC verification, and scalable ZK-Rollups.

---

## 2. Key Takeaways

- Public blockchains are fully transparent by default.
- ZKPs enable mathematical proof verification without revealing underlying sensitive information.
`,
    questions: [
      {
        id: 801,
        text: "Are transactions on a standard public blockchain private by default?",
        options: ["Yes, everything is encrypted", "No, all balances and transfers are completely visible to the public", "Only to the government", "Only to validators"],
        correctAnswerIndex: 1
      },
      {
        id: 802,
        text: "What does a Zero-Knowledge Proof allow you to do?",
        options: ["Hack into smart contracts", "Prove a statement is true without revealing the underlying data", "Delete transactions from the blockchain", "Double-spend tokens safely"],
        correctAnswerIndex: 1
      },
      {
        id: 803,
        text: "Which of these is a valid use case for ZKPs?",
        options: ["Proving you have sufficient funds without revealing your balance", "Creating an un-hackable password", "Making your computer run faster", "Generating free ETH"],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 9,
    title: "Building on Arc",
    description: "Setup your developer environment, configure Hardhat, and connect to the Arc L1 testnet.",
    content: `
# Module 9: Hardhat Setup & Arc Testnet Tooling

Learn how to configure Hardhat, manage environment variables, and connect your contract deployment pipeline to Arc L1.

---

## 1. Hardhat Configuration

\`\`\`javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    arcTestnet: {
      url: "https://rpc.arc.network/testnet",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
\`\`\`

---

## 2. Key Takeaways

- Standard Ethereum developer tools like Hardhat and Foundry work out of the box with Arc L1.
- Testnet faucets supply free test tokens to fund deployment gas fees.
`,
    questions: [
      {
        id: 901,
        text: "Because Arc L1 is EVM-compatible, you can use tools like:",
        options: ["Android Studio", "Hardhat and Foundry", "Unity Engine", "Xcode"],
        correctAnswerIndex: 1
      },
      {
        id: 902,
        text: "Where do you configure the RPC URL in a Hardhat project?",
        options: ["package.json", "hardhat.config.js", "index.html", "deploy.js"],
        correctAnswerIndex: 1
      },
      {
        id: 903,
        text: "How do you get tokens to pay for gas on a testnet?",
        options: ["Buy them on Coinbase", "Use a testnet Faucet", "Mine them with your CPU", "Email the CEO"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 10,
    title: "Deploying Applications",
    description: "Compile, deploy, and verify your smart contract on the Arc L1 blockchain.",
    content: `
# Module 10: Contract Deployment & Block Explorer Verification

In this final module, we cover smart contract compilation, deployment scripts, and verifying source code on block explorers.

---

## 1. Deployment Execution

\`\`\`bash
npx hardhat run scripts/deploy.js --network arcTestnet
\`\`\`

---

## 2. Contract Verification

Source code verification matches your local Solidity source code against compiled on-chain bytecode, granting users transparent auditability.

---

## 3. Key Takeaways

- Deployment writes compiled contract bytecode into the permanent global state of Arc L1.
- Verifying contracts builds user trust by publishing readable source code on block explorers.
`,
    questions: [
      {
        id: 1001,
        text: "What does deploying a smart contract actually do?",
        options: ["Saves the code to your local hard drive", "Uploads the compiled bytecode to the blockchain state", "Deletes the code from the blockchain", "Sends an email to the validators"],
        correctAnswerIndex: 1
      },
      {
        id: 1002,
        text: "Why is it important to 'verify' a contract on a block explorer?",
        options: ["To get free gas", "To prove to users that the deployed bytecode matches your open-source Solidity code", "To make the contract run faster", "To hide the code from hackers"],
        correctAnswerIndex: 1
      },
      {
        id: 1003,
        text: "Which hardhat command is used to run deployment scripts?",
        options: ["hardhat test", "hardhat compile", "hardhat run / hardhat ignition deploy", "hardhat node"],
        correctAnswerIndex: 2
      }
    ]
  }
];
