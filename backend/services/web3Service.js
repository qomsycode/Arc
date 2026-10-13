const { ethers } = require('ethers');

// Ensure environment variables are loaded
require('dotenv').config();

const ARC_RPC_URL = process.env.ARC_RPC_URL;
const PLATFORM_PRIVATE_KEY = process.env.PLATFORM_WALLET_PRIVATE_KEY;
const REWARD_DISTRIBUTOR_ADDRESS = process.env.REWARD_DISTRIBUTOR_ADDRESS;

// Arc native USDC ERC-20 precompile address (6 decimals)
const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

// Each quiz reward is 0.01 USDC = 10,000 units (6 decimals)
const REWARD_UNIT_AMOUNT = 10000n;

if (!ARC_RPC_URL || !PLATFORM_PRIVATE_KEY || !REWARD_DISTRIBUTOR_ADDRESS) {
  console.warn('WARNING: Missing critical Web3 environment variables for rewards.');
}

// Minimal ABIs
const rewardDistributorAbi = [
  "function sendReward(address user, uint256 lessonId) external"
];
const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)"
];

// Initialize Provider and Wallet
const provider = new ethers.JsonRpcProvider(ARC_RPC_URL);
const wallet = new ethers.Wallet(PLATFORM_PRIVATE_KEY, provider);

// Initialize Contract Instances
const rewardContract = new ethers.Contract(REWARD_DISTRIBUTOR_ADDRESS, rewardDistributorAbi, wallet);
const usdcContract = new ethers.Contract(ARC_USDC_ADDRESS, erc20Abi, provider);

/**
 * Check whether the RewardDistributor contract holds enough USDC to pay one reward.
 * @returns {{ sufficient: boolean, balanceUsdc: string }}
 */
const checkContractBalance = async () => {
  try {
    const balance = await usdcContract.balanceOf(REWARD_DISTRIBUTOR_ADDRESS);
    const sufficient = balance >= REWARD_UNIT_AMOUNT;
    const balanceUsdc = (Number(balance) / 1_000_000).toFixed(6);
    console.log(`Contract USDC balance: ${balanceUsdc} (sufficient for payout: ${sufficient})`);
    return { sufficient, balanceUsdc };
  } catch (err) {
    console.error('Failed to check contract balance:', err.message);
    // If the balance check itself fails, optimistically attempt the tx
    return { sufficient: true, balanceUsdc: 'unknown' };
  }
};

/**
 * Trigger the RewardDistributor smart contract to send 0.01 USDC to the user.
 *
 * Returns a status object:
 *   { status: 'sent', txHash }        — reward dispatched on-chain
 *   { status: 'insufficient_funds' }  — contract is empty; reward will be queued
 *   { status: 'error' }               — unexpected failure
 *
 * @param {string} userWalletAddress - The student's wallet address (0x...)
 * @param {number} lessonId - The lesson they completed
 */
const sendQuizReward = async (userWalletAddress, lessonId) => {
  try {
    // Pre-flight: verify contract has enough USDC before broadcasting a tx
    const { sufficient, balanceUsdc } = await checkContractBalance();
    if (!sufficient) {
      console.warn(`Reward pool empty (balance: ${balanceUsdc} USDC). Queuing reward for lesson ${lessonId}.`);
      return { status: 'insufficient_funds' };
    }

    console.log(`Sending reward to: ${userWalletAddress} for Lesson: ${lessonId}`);
    const tx = await rewardContract.sendReward(userWalletAddress, lessonId);
    console.log(`Transaction sent! Hash: ${tx.hash}`);

    return { status: 'sent', txHash: tx.hash };
  } catch (error) {
    console.error('Web3 sendReward failed:', error.message);
    return { status: 'error' };
  }
};

module.exports = {
  sendQuizReward,
  checkContractBalance
};
