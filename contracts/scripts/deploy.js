const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

// Arc Mainnet USDC ERC-20 contract address (6 decimals)
const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('='.repeat(50));
  console.log('ARCademy — RewardDistributor Deployment');
  console.log('='.repeat(50));
  console.log('Deployer wallet :', deployer.address);

  // On Arc, USDC is the gas token — show balance in USDC (6 decimals)
  const balance = await ethers.provider.getBalance(deployer.address);
  const usdcBalance = ethers.formatUnits(balance, 18); // native uses 18 decimals
  console.log('Deployer balance:', usdcBalance, 'USDC (native)');
  console.log('USDC address    :', ARC_USDC_ADDRESS);
  console.log('-'.repeat(50));

  // Deploy the contract
  console.log('Deploying RewardDistributor...');
  const RewardDistributor = await ethers.getContractFactory('RewardDistributor');
  const contract = await RewardDistributor.deploy(ARC_USDC_ADDRESS);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log('✅ RewardDistributor deployed to:', contractAddress);
  console.log('='.repeat(50));
  console.log('NEXT STEPS:');
  console.log('1. Copy the address above into contracts/.env → REWARD_DISTRIBUTOR_ADDRESS');
  console.log('2. Copy it into backend/.env → REWARD_DISTRIBUTOR_ADDRESS');
  console.log('3. Update Render backend env var → REWARD_DISTRIBUTOR_ADDRESS');
  console.log('4. Fund the contract by sending USDC to:', contractAddress);
  console.log('5. Run: npm run deploy:mainnet (already done!)');
  console.log('='.repeat(50));

  // Save deployment info to a local file for reference
  const deploymentInfo = {
    network: 'arcMainnet',
    chainId: 5042,
    contractAddress,
    usdcAddress: ARC_USDC_ADDRESS,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    quizRewardUSDC: '$0.01 (10000 units)',
  };

  const outPath = path.join(__dirname, '..', 'deployment.json');
  fs.writeFileSync(outPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('Deployment info saved to contracts/deployment.json');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Deployment failed:', err);
    process.exit(1);
  });
