// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title InvestmentPlatform
 * @dev Main contract for DeFi investment platform with KYC, risk profiles, and fund management
 */
contract InvestmentPlatform is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant KYC_MANAGER_ROLE = keccak256("KYC_MANAGER_ROLE");
    bytes32 public constant INVESTMENT_MANAGER_ROLE = keccak256("INVESTMENT_MANAGER_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    // Risk profiles
    enum RiskProfile { CONSERVATIVE, MODERATE, AGGRESSIVE }

    // Investment strategies
    struct Strategy {
        string name;
        address strategyAddress;
        RiskProfile riskProfile;
        uint256 lockupPeriod; // in seconds
        bool active;
    }

    // User data
    struct User {
        bool kycVerified;
        RiskProfile riskProfile;
        uint256 fiatBalance; // in BOB (smallest unit)
        uint256 tokenBalance; // in wei
        uint256 lockedUntil; // timestamp
        uint256 currentStrategyId;
    }

    // Events
    event UserRegistered(address indexed user, string kycId);
    event KYCVerified(address indexed user);
    event RiskProfileUpdated(address indexed user, RiskProfile newProfile);
    event FiatDeposited(address indexed user, uint256 amount);
    event TokensConverted(uint256 totalFiat, uint256 totalTokens, uint256 rate);
    event StrategyCreated(uint256 indexed strategyId, string name, RiskProfile riskProfile);
    event FundsInvested(uint256 indexed strategyId, uint256 amount);
    event WithdrawalRequested(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    // State variables
    mapping(address => User) public users;
    mapping(string => address) public kycIdToAddress; // KYC ID to address mapping
    mapping(uint256 => Strategy) public strategies;
    
    uint256 public strategyCounter;
    uint256 public pendingFiatPool; // Total pending FIAT for conversion
    uint256 public fiatToTokenThreshold; // Threshold for FIAT to token conversion
    uint256 public lastConversionRate; // Last BOB to token conversion rate
    
    address public treasuryWallet; // LIBRECAMBISTA wallet
    IERC20 public stablecoin; // USDT or USDC
    
    uint256 public constant CONSERVATIVE_LOCKUP = 180 days; // 6 months
    uint256 public constant RATE_PRECISION = 1e18;

    constructor(
        address _treasuryWallet,
        address _stablecoin,
        uint256 _fiatThreshold
    ) {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");
        require(_stablecoin != address(0), "Invalid stablecoin address");
        
        treasuryWallet = _treasuryWallet;
        stablecoin = IERC20(_stablecoin);
        fiatToTokenThreshold = _fiatThreshold;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(KYC_MANAGER_ROLE, msg.sender);
        _grantRole(INVESTMENT_MANAGER_ROLE, msg.sender);
        _grantRole(TREASURY_ROLE, _treasuryWallet);
    }

    /**
     * @dev Register a new user with KYC ID
     * @param user Address of the user
     * @param kycId Unique KYC identifier from Web2 database
     */
    function registerUser(address user, string calldata kycId) 
        external 
        onlyRole(KYC_MANAGER_ROLE) 
    {
        require(user != address(0), "Invalid user address");
        require(bytes(kycId).length > 0, "Invalid KYC ID");
        require(!users[user].kycVerified, "User already registered");
        require(kycIdToAddress[kycId] == address(0), "KYC ID already used");

        users[user] = User({
            kycVerified: false,
            riskProfile: RiskProfile.CONSERVATIVE,
            fiatBalance: 0,
            tokenBalance: 0,
            lockedUntil: 0,
            currentStrategyId: 0
        });

        kycIdToAddress[kycId] = user;
        users[user].kycVerified = true; // Initial verification
        emit UserRegistered(user, kycId);
    }

    /**
     * @dev Verify user's KYC
     * @param user Address of the user
     */
    function verifyKYC(address user) 
        external 
        onlyRole(KYC_MANAGER_ROLE) 
    {
        require(kycIdToAddress[users[user].kycVerified ? "" : "exists"] != address(0), "User not registered");
        users[user].kycVerified = true;
        emit KYCVerified(user);
    }

    /**
     * @dev Update user's risk profile
     * @param user Address of the user
     * @param newProfile New risk profile
     */
    function updateRiskProfile(address user, RiskProfile newProfile) 
        external 
        onlyRole(KYC_MANAGER_ROLE) 
    {
        require(users[user].kycVerified, "User not KYC verified");
        require(users[user].tokenBalance == 0, "Cannot change profile with active investments");
        
        users[user].riskProfile = newProfile;
        emit RiskProfileUpdated(user, newProfile);
    }

    /**
     * @dev Record FIAT deposit (called after QR code transfer)
     * @param user Address of the user
     * @param amount Amount in BOB (smallest unit)
     */
    function recordFiatDeposit(address user, uint256 amount) 
        external 
        onlyRole(TREASURY_ROLE) 
    {
        require(users[user].kycVerified, "User not KYC verified");
        require(amount > 0, "Invalid amount");

        users[user].fiatBalance += amount;
        pendingFiatPool += amount;
        
        emit FiatDeposited(user, amount);

        // Check if threshold reached for conversion
        if (pendingFiatPool >= fiatToTokenThreshold) {
            _requestTokenConversion();
        }
    }

    /**
     * @dev Convert FIAT pool to tokens (called by treasury)
     * @param totalTokens Total tokens received from conversion
     * @param conversionRate Rate used for conversion (with RATE_PRECISION decimals)
     */
    function executeFiatToTokenConversion(uint256 totalTokens, uint256 conversionRate) 
        external 
        onlyRole(TREASURY_ROLE) 
        nonReentrant
    {
        require(totalTokens > 0, "Invalid token amount");
        require(conversionRate > 0, "Invalid conversion rate");
        require(pendingFiatPool > 0, "No pending FIAT");

        // Transfer tokens from treasury to contract
        stablecoin.safeTransferFrom(treasuryWallet, address(this), totalTokens);
        
        lastConversionRate = conversionRate;
        uint256 convertedFiat = pendingFiatPool;
        pendingFiatPool = 0;

        emit TokensConverted(convertedFiat, totalTokens, conversionRate);
    }

    /**
     * @dev Convert user's FIAT balance to token balance
     * @param user Address of the user
     */
    function convertUserBalance(address user) 
        external 
        nonReentrant
    {
        require(users[user].kycVerified, "User not KYC verified");
        require(users[user].fiatBalance > 0, "No FIAT balance");
        require(lastConversionRate > 0, "No conversion rate available");

        uint256 fiatAmount = users[user].fiatBalance;
        uint256 tokenAmount = (fiatAmount * RATE_PRECISION) / lastConversionRate;
        
        users[user].fiatBalance = 0;
        users[user].tokenBalance += tokenAmount;
    }

    /**
     * @dev Create a new investment strategy
     * @param name Strategy name
     * @param strategyAddress Address of the strategy contract
     * @param riskProfile Risk profile for the strategy
     * @param lockupPeriod Lockup period in seconds
     */
    function createStrategy(
        string calldata name,
        address strategyAddress,
        RiskProfile riskProfile,
        uint256 lockupPeriod
    ) 
        external 
        onlyRole(INVESTMENT_MANAGER_ROLE) 
    {
        require(strategyAddress != address(0), "Invalid strategy address");
        require(bytes(name).length > 0, "Invalid strategy name");

        uint256 strategyId = strategyCounter++;
        strategies[strategyId] = Strategy({
            name: name,
            strategyAddress: strategyAddress,
            riskProfile: riskProfile,
            lockupPeriod: lockupPeriod,
            active: true
        });

        emit StrategyCreated(strategyId, name, riskProfile);
    }

    /**
     * @dev Invest user funds into a strategy
     * @param user Address of the user
     * @param strategyId ID of the strategy
     */
    function investUserFunds(address user, uint256 strategyId) 
        external 
        onlyRole(INVESTMENT_MANAGER_ROLE) 
        nonReentrant
    {
        require(users[user].kycVerified, "User not KYC verified");
        require(users[user].tokenBalance > 0, "No token balance");
        require(strategies[strategyId].active, "Strategy not active");
        require(
            strategies[strategyId].riskProfile == users[user].riskProfile,
            "Risk profile mismatch"
        );

        uint256 amount = users[user].tokenBalance;
        users[user].currentStrategyId = strategyId;
        users[user].lockedUntil = block.timestamp + strategies[strategyId].lockupPeriod;

        // Transfer tokens to strategy contract
        stablecoin.safeTransfer(strategies[strategyId].strategyAddress, amount);

        emit FundsInvested(strategyId, amount);
    }

    /**
     * @dev Request withdrawal (after lockup period)
     * @param amount Amount to withdraw
     */
    function requestWithdrawal(uint256 amount) 
        external 
        nonReentrant
        whenNotPaused
    {
        require(users[msg.sender].kycVerified, "User not KYC verified");
        require(users[msg.sender].tokenBalance >= amount, "Insufficient balance");
        require(block.timestamp >= users[msg.sender].lockedUntil, "Funds still locked");

        users[msg.sender].tokenBalance -= amount;
        stablecoin.safeTransfer(msg.sender, amount);

        emit WithdrawalRequested(msg.sender, amount);
    }

    /**
     * @dev Emergency withdrawal (with penalty)
     */
    function emergencyWithdraw() 
        external 
        nonReentrant
    {
        require(users[msg.sender].tokenBalance > 0, "No balance");

        uint256 amount = users[msg.sender].tokenBalance;
        uint256 penalty = (amount * 10) / 100; // 10% penalty
        uint256 withdrawAmount = amount - penalty;

        users[msg.sender].tokenBalance = 0;
        users[msg.sender].lockedUntil = 0;

        stablecoin.safeTransfer(msg.sender, withdrawAmount);
        stablecoin.safeTransfer(treasuryWallet, penalty);

        emit EmergencyWithdraw(msg.sender, withdrawAmount);
    }

    /**
     * @dev Pause/unpause contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Internal function to request token conversion
     */
    function _requestTokenConversion() private {
        // This would emit an event or call an oracle to notify off-chain systems
        // that FIAT conversion is needed
    }

    /**
     * @dev Get user details
     */
    function getUserDetails(address user) 
        external 
        view 
        returns (
            bool kycVerified,
            RiskProfile riskProfile,
            uint256 fiatBalance,
            uint256 tokenBalance,
            uint256 lockedUntil,
            uint256 currentStrategyId
        ) 
    {
        User memory u = users[user];
        return (
            u.kycVerified,
            u.riskProfile,
            u.fiatBalance,
            u.tokenBalance,
            u.lockedUntil,
            u.currentStrategyId
        );
    }
}