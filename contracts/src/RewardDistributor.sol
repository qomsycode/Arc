// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RewardDistributor
 * @dev Distributes USDC rewards to users upon completing educational quizzes.
 * This is a foundational contract for ARCademy on Arc L1.
 */
contract RewardDistributor {
    address public owner;
    
    // In production, this would interface with the real USDC ERC20 contract.
    // For now, this is scaffolding ready for Phase 3 integration.
    
    event RewardSent(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Sends USDC to a user who passed a quiz.
     * Called by the ARCademy backend service.
     * @param user The address of the student's wallet
     * @param amount The amount of USDC to send
     */
    function sendReward(address user, uint256 amount) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        
        // TODO: IERC20(usdcAddress).transfer(user, amount);
        
        emit RewardSent(user, amount);
    }
}
