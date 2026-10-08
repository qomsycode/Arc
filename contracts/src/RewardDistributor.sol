// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RewardDistributor
 * @notice Distributes USDC rewards to students who pass ARCademy quizzes.
 * @dev Deployed on Arc Mainnet (Chain ID: 5042).
 *      USDC on Arc: 0x3600000000000000000000000000000000000000 (6 decimals, ERC-20 interface)
 *      Only the owner (ARCademy backend wallet) can call sendReward().
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract RewardDistributor {
    address public owner;
    IERC20 public usdc;

    // $0.01 USDC = 10000 units (6 decimals)
    uint256 public constant QUIZ_REWARD = 10000;

    event RewardSent(address indexed user, uint256 amount, uint256 lessonId);
    event ContractFunded(address indexed funder, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * @param _usdcAddress The USDC ERC-20 contract address on Arc Mainnet
     */
    constructor(address _usdcAddress) {
        owner = msg.sender;
        usdc = IERC20(_usdcAddress);
    }

    /**
     * @notice Send a $0.01 USDC reward to a student who passed a quiz.
     * @dev Called by the ARCademy backend service wallet after grading.
     * @param user The student's wallet address
     * @param lessonId The lesson ID they completed (for event tracking)
     */
    function sendReward(address user, uint256 lessonId) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(
            usdc.balanceOf(address(this)) >= QUIZ_REWARD,
            "Insufficient USDC in contract"
        );

        bool success = usdc.transfer(user, QUIZ_REWARD);
        require(success, "USDC transfer failed");

        emit RewardSent(user, QUIZ_REWARD, lessonId);
    }

    /**
     * @notice Check how much USDC is left in the contract.
     */
    function getBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Owner can withdraw all remaining USDC (e.g. to refill or shut down).
     */
    function withdraw() external onlyOwner {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "Nothing to withdraw");
        bool success = usdc.transfer(owner, balance);
        require(success, "Withdraw failed");
        emit Withdrawn(owner, balance);
    }

    /**
     * @notice Transfer ownership to a new address.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
