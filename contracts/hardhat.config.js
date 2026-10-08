require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const rawKey = process.env.DEPLOYER_PRIVATE_KEY || '';
const isValidKey = /^0x[0-9a-fA-F]{64}$/.test(rawKey) || /^[0-9a-fA-F]{64}$/.test(rawKey);
const accounts = isValidKey ? [rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },

  networks: {
    // Arc Mainnet — Chain ID 5042
    arcMainnet: {
      url: 'https://rpc.mainnet.arc.io',
      chainId: 5042,
      accounts: accounts,
    },

    // Arc Testnet — Chain ID 5042002
    arcTestnet: {
      url: 'https://rpc.testnet.arc.io',
      chainId: 5042002,
      accounts: accounts,
    },

    // Local hardhat network (for unit tests)
    hardhat: {
      chainId: 31337,
    }
  },

  paths: {
    sources: './src',
    tests:   './test',
    cache:   './cache',
    artifacts: './artifacts'
  }
};
