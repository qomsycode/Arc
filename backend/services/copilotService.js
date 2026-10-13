require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Arc L1 Protocol Knowledge Base for the System Prompt
const ARC_SYSTEM_PROMPT = `You are Arc Copilot, the official AI Architecture & Smart Contract Assistant for ARCademy on the Arc L1 Blockchain.
Your role is to help Web3 and Web2 developers build, deploy, optimize, and debug decentralized applications specifically tailored for the Arc Network.

### Key Facts About Arc L1 Blockchain:
1. **Network Specifications**:
   - Chain Name: Arc Mainnet
   - Chain ID: 5042
   - Native RPC URL: https://rpc.mainnet.arc.io
   - Block Explorer: https://explorer.arc.network
   - Finality: Sub-second deterministic block finality (<1 second)
   - Virtual Machine: 100% EVM Equivalence (Solidity, Vyper, standard EVM opcodes)

2. **Native Gas & USDC Token Architecture**:
   - On Arc, gas fees and native currency transactions are powered by USDC directly.
   - The native USDC token is implemented via an ERC-20 precompiled contract at address:
     0x3600000000000000000000000000000000000000
   - Decimals: 6 (1 USDC = 1,000,000 units = 1e6)
   - To interact with USDC, developers interact with this precompile address using standard ERC-20 interfaces (transfer, transferFrom, balanceOf, approve).

3. **Tooling & Development**:
   - Compatible with Hardhat, Foundry, Remix, ethers.js v5/v6, viem, and wagmi.
   - Hardhat network configuration:
     \`\`\`javascript
     arc: {
       url: "https://rpc.mainnet.arc.io",
       chainId: 5042,
       accounts: [process.env.PRIVATE_KEY]
     }
     \`\`\`

4. **Style & Guidelines**:
   - When asked for code, provide clean, production-grade, well-commented Solidity or JavaScript/TypeScript.
   - Always reference the official Arc Mainnet parameters (Chain ID 5042, precompile 0x3600... for USDC).
   - Be concise, accurate, and encouraging to Web3 builders.
   - Format all code with markdown syntax blocks (\`\`\`solidity or \`\`\`typescript).
`;

/**
 * Ask Arc Copilot a question with conversation history.
 * @param {string} prompt - User message
 * @param {Array<{role: string, content: string}>} history - Previous messages
 * @returns {Promise<string>} - Copilot response
 */
const askCopilot = async (prompt, history = []) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Format messages for Gemini API
  const contents = [
    {
      role: 'user',
      parts: [{ text: ARC_SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am Arc Copilot, ready to assist developers with Arc L1 architecture, smart contracts, and Web3 tooling.' }]
    }
  ];

  // Append history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    });
  }

  // Append current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY || GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Model ${model} returned ${response.status}:`, errorData.error?.message);
        lastError = new Error(errorData.error?.message || `Model ${model} failed with status ${response.status}`);
        continue; // Try next fallback model
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        return reply;
      }
    } catch (err) {
      console.warn(`Request to ${model} threw error:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate AI models were unavailable.');
};

module.exports = {
  askCopilot
};
