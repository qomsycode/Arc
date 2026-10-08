const { ethers } = require('ethers');

// Ensure environment variables are loaded
require('dotenv').config();

const ARC_RPC_URL = process.env.ARC_RPC_URL;
const PLATFORM_PRIVATE_KEY = process.env.PLATFORM_WALLET_PRIVATE_KEY;
const REWARD_DISTRIBUTOR_ADDRESS = process.env.REWARD_DISTRIBUTOR_ADDRESS;

// Arc native USDC ERC-20 precompile address
const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

if (!ARC_RPC_URL || !PLATFORM_PRIVATE_KEY || !REWARD_DISTRIBUTOR_ADDRESS) {
  console.warn('WARNING: Missing critical Web3 environment variables for rewards.');
}

// Minimal ABI to call `sendReward` on our contract
const rewardDistributorAbi = [
  "function sendReward(address user, uint256 lessonId) external"
];

// Initialize Provider and Wallet
const provider = new ethers.JsonRpcProvider(ARC_RPC_URL);
const wallet = new ethers.Wallet(PLATFORM_PRIVATE_KEY, provider);

// Initialize Contract Instance
const rewardContract = new ethers.Contract(REWARD_DISTRIBUTOR_ADDRESS, rewardDistributorAbi, wallet);

/**
 * Trigger the RewardDistributor smart contract to send 0.01 USDC to the user.
 * @param {string} userWalletAddress - The student's wallet address (0x...)
 * @param {number} lessonId - The lesson they completed
 * @returns {string|null} - Transaction hash, or null if it fails
 */
const sendQuizReward = async (userWalletAddress, lessonId) => {
  try {
    console.log(`Initiating Web3 reward transaction...`);
    console.log(`Sending reward to: ${userWalletAddress} for Lesson: ${lessonId}`);

    // Call the smart contract function
    const tx = await rewardContract.sendReward(userWalletAddress, lessonId);
    
    console.log(`Transaction sent to Arc Mainnet! Hash: ${tx.hash}`);
    
    // We do NOT await tx.wait() here to keep the API response fast.
    // The transaction will mine in the background in a few seconds.
    // (If you wanted to guarantee completion before responding, you'd do await tx.wait())
    
    return tx.hash;
  } catch (error) {
    console.error('Web3 sendReward failed:', error.message);
    return null;
  }
};

module.exports = {
  sendQuizReward
};
