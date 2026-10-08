require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';

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
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },

    // Arc Testnet — Chain ID 5042002
    arcTestnet: {
      url: 'https://rpc.testnet.arc.io',
      chainId: 5042002,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
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
