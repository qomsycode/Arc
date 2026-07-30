export interface Challenge {
  id: number;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  bountyAmount: number;
  description: string;
  objectives: string[];
  requirements: string[];
  starterResources: { title: string; url: string }[];
}

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Create a Wallet",
    category: "Wallet Infrastructure",
    difficulty: "Beginner",
    bountyAmount: 20.0,
    description: "Build a frontend web application that generates an EVM wallet keypair or connects an embedded wallet on Arc L1.",
    objectives: [
      "Set up an ethers.js or viem provider connected to Arc L1.",
      "Allow users to create a new keypair or connect via Web3 auth.",
      "Display the public address, native token balance, and USDC balance."
    ],
    requirements: [
      "Repository must contain a working React or Vue web application.",
      "Must correctly query USDC 6-decimal token balances.",
      "Includes a README with local setup instructions."
    ],
    starterResources: [
      { title: "Ethers.js Documentation", url: "https://docs.ethers.org/v6/" },
      { title: "Privy Embedded Wallet Docs", url: "https://docs.privy.io/" }
    ]
  },
  {
    id: 2,
    title: "Send USDC",
    category: "Transactions",
    difficulty: "Beginner",
    bountyAmount: 25.0,
    description: "Build a simple web interface that allows users to enter a recipient address and transfer native USDC on Arc L1.",
    objectives: [
      "Create an input form for recipient address and USDC amount.",
      "Format transaction using 6 decimal precision.",
      "Sign and broadcast the transaction, displaying the transaction hash on completion."
    ],
    requirements: [
      "Must validate recipient address format before sending.",
      "Must show transaction status (pending, success, failed).",
      "Link transaction hash to Arc block explorer."
    ],
    starterResources: [
      { title: "ERC20 Transfer Specification", url: "https://eips.ethereum.org/EIPS/eip-20" }
    ]
  },
  {
    id: 3,
    title: "Build a Payment Link",
    category: "Payments",
    difficulty: "Intermediate",
    bountyAmount: 40.0,
    description: "Create a web app where merchants can generate custom USDC payment links or QR codes for specific dollar amounts.",
    objectives: [
      "Allow merchants to set dollar amount and memo/description.",
      "Generate a dynamic link and QR code containing EIP-681 payment instructions.",
      "Payer scans QR code or opens link to complete transaction with 1-click."
    ],
    requirements: [
      "QR code generation must adhere to EIP-681 standard.",
      "Merchant dashboard displays live transaction confirmation updates via WebSockets or RPC polling."
    ],
    starterResources: [
      { title: "EIP-681 Payment Requests", url: "https://eips.ethereum.org/EIPS/eip-681" }
    ]
  },
  {
    id: 4,
    title: "Build a Simple Escrow Application",
    category: "Smart Contracts",
    difficulty: "Intermediate",
    bountyAmount: 50.0,
    description: "Deploy a Solidity smart contract on Arc L1 that holds USDC in escrow until the buyer confirms product delivery.",
    objectives: [
      "Write a Solidity contract with deposit(), confirmDelivery(), and refund() methods.",
      "Build a React frontend to manage escrow states as Buyer, Seller, or Arbiter."
    ],
    requirements: [
      "Solidity contract source code fully verified on Arc explorer.",
      "Frontend must display real-time escrow state transitions."
    ],
    starterResources: [
      { title: "OpenZeppelin SafeERC20 Guide", url: "https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#SafeERC20" }
    ]
  },
  {
    id: 5,
    title: "Create an Invoice Generator",
    category: "DeFi Tools",
    difficulty: "Intermediate",
    bountyAmount: 45.0,
    description: "Build an on-chain invoicing platform where freelancers can issue USDC invoices and track payment status.",
    objectives: [
      "Create, store, and share digital invoices.",
      "Listen for on-chain USDC transfer events matching invoice payment IDs.",
      "Export PDF receipt upon payment."
    ],
    requirements: [
      "Support multi-item invoice lines with automated tax/total calculation.",
      "Automatic mark as Paid when matching transaction is detected on-chain."
    ],
    starterResources: [
      { title: "Ethers.js Contract Events Filtering", url: "https://docs.ethers.org/v6/api/contract/#Contract-on" }
    ]
  },
  {
    id: 6,
    title: "Build a Payroll System",
    category: "Enterprise",
    difficulty: "Advanced",
    bountyAmount: 75.0,
    description: "Create an automated batch payment application that sends monthly USDC salaries to multiple employee wallets in a single transaction.",
    objectives: [
      "CSV upload for employee wallet list and salary amounts.",
      "Batch transfer smart contract (Disperse/Multisend) to execute transfers efficiently.",
      "Detailed payment history and payroll log."
    ],
    requirements: [
      "Must execute batch transfers in a single atomic transaction to minimize gas fees.",
      "Frontend includes CSV parser and preview table before execution."
    ],
    starterResources: [
      { title: "Disperse Contract Example", url: "https://github.com/derekchiang/disperse" }
    ]
  }
];
