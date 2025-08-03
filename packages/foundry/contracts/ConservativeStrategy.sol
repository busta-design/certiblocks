// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ConservativeStrategy
 * @dev Implementation of a conservative investment strategy with 6-month lockup
 */
contract ConservativeStrategy is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Investment {
        uint256 amount;
        uint256 startTime;
        uint256 expectedReturn; // basis points (10000 = 100%)
    }

    // Events
    event FundsReceived(uint256 amount, uint256 timestamp);
    event FundsInvested(address indexed protocol, uint256 amount);
    event ReturnsGenerated(uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);

    // State variables
    IERC20 public immutable stablecoin;
    address public immutable investmentPlatform;
    
    uint256 public totalInvested;
    uint256 public totalReturns;
    uint256 public targetAPY = 800; // 8% APY in basis points
    
    // Tracking investments
    mapping(address => Investment) public investments;
    
    // DeFi protocols for conservative strategy (stablecoin lending)
    address public aavePool;
    address public compoundPool;
    
    modifier onlyPlatform() {
        require(msg.sender == investmentPlatform, "Only platform can call");
        _;
    }

    constructor(
        address _stablecoin,
        address _investmentPlatform,
        address _owner
    ) Ownable(_owner) {
        require(_stablecoin != address(0), "Invalid stablecoin");
        require(_investmentPlatform != address(0), "Invalid platform");
        
        stablecoin = IERC20(_stablecoin);
        investmentPlatform = _investmentPlatform;
    }

    /**
     * @dev Receive funds from the investment platform
     * @notice Only the investment platform can send funds
     */
    function receiveFunds() 
        external 
        onlyPlatform 
        nonReentrant 
        returns (uint256) 
    {
        uint256 balance = stablecoin.balanceOf(address(this));
        require(balance > 0, "No funds received");
        
        totalInvested += balance;
        
        emit FundsReceived(balance, block.timestamp);
        
        // Automatically invest in conservative DeFi protocols
        _investFunds(balance);
        
        return balance;
    }

    /**
     * @dev Internal function to invest funds in DeFi protocols
     * @param amount Amount to invest
     */
    function _investFunds(uint256 amount) private {
        // In a real implementation, this would:
        // 1. Split funds between multiple lending protocols
        // 2. Supply stablecoins to Aave/Compound for yield
        // 3. Maybe stake in Curve's 3pool for additional yield
        
        // For hackathon purposes, we'll simulate the investment
        emit FundsInvested(address(this), amount);
    }

    /**
     * @dev Calculate returns for a given period
     * @param principal Principal amount
     * @param duration Duration in seconds
     */
    function calculateReturns(uint256 principal, uint256 duration) 
        public 
        view 
        returns (uint256) 
    {
        // Simple interest calculation for conservative strategy
        // Returns = Principal * APY * Duration / (365 days * 10000)
        return (principal * targetAPY * duration) / (365 days * 10000);
    }

    /**
     * @dev Withdraw funds back to the platform
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function withdrawToUser(uint256 amount, address recipient) 
        external 
        onlyPlatform 
        nonReentrant 
    {
        require(amount <= stablecoin.balanceOf(address(this)), "Insufficient balance");
        
        stablecoin.safeTransfer(recipient, amount);
        
        emit FundsWithdrawn(recipient, amount);
    }

    /**
     * @dev Update DeFi protocol addresses
     * @param _aavePool Aave lending pool address
     * @param _compoundPool Compound pool address
     */
    function updateProtocols(address _aavePool, address _compoundPool) 
        external 
        onlyOwner 
    {
        aavePool = _aavePool;
        compoundPool = _compoundPool;
    }

    /**
     * @dev Update target APY
     * @param _targetAPY New target APY in basis points
     */
    function updateTargetAPY(uint256 _targetAPY) 
        external 
        onlyOwner 
    {
        require(_targetAPY <= 2000, "APY too high for conservative strategy");
        targetAPY = _targetAPY;
    }

    /**
     * @dev Emergency withdrawal function
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) 
        external 
        onlyOwner 
    {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @dev Get strategy performance metrics
     */
    function getPerformanceMetrics() 
        external 
        view 
        returns (
            uint256 _totalInvested,
            uint256 _totalReturns,
            uint256 _currentBalance,
            uint256 _targetAPY
        ) 
    {
        return (
            totalInvested,
            totalReturns,
            stablecoin.balanceOf(address(this)),
            targetAPY
        );
    }
}