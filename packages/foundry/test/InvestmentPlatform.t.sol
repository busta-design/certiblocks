// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/InvestmentPlatform.sol";
import "../contracts/ConservativeStrategy.sol";
import "../contracts/mocks/MockStablecoin.sol";

contract InvestmentPlatformTest is Test {
    InvestmentPlatform public platform;
    ConservativeStrategy public strategy;
    MockStablecoin public stablecoin;

    address public admin = makeAddr("admin");
    address public kycManager = makeAddr("kycManager");
    address public investmentManager = makeAddr("investmentManager");
    address public treasury = makeAddr("treasury");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    uint256 public constant FIAT_THRESHOLD = 10000 * 1e6; // 10,000 USDC threshold
    string public constant KYC_ID_1 = "KYC123";
    string public constant KYC_ID_2 = "KYC456";

    event UserRegistered(address indexed user, string kycId);
    event KYCVerified(address indexed user);
    event RiskProfileUpdated(address indexed user, InvestmentPlatform.RiskProfile newProfile);
    event FiatDeposited(address indexed user, uint256 amount);
    event TokensConverted(uint256 totalFiat, uint256 totalTokens, uint256 rate);
    event StrategyCreated(uint256 indexed strategyId, string name, InvestmentPlatform.RiskProfile riskProfile);
    event FundsInvested(uint256 indexed strategyId, uint256 amount);
    event WithdrawalRequested(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    function setUp() public {
        vm.startPrank(admin);

        // Deploy contracts
        stablecoin = new MockStablecoin();
        platform = new InvestmentPlatform(treasury, address(stablecoin), FIAT_THRESHOLD);
        strategy = new ConservativeStrategy(address(stablecoin), address(platform), admin);

        // Grant roles
        platform.grantRole(platform.KYC_MANAGER_ROLE(), kycManager);
        platform.grantRole(platform.INVESTMENT_MANAGER_ROLE(), investmentManager);

        // Mint tokens to treasury for conversions
        stablecoin.mint(treasury, 1_000_000 * 1e6);

        vm.stopPrank();
    }

    // ========== REGISTRATION TESTS ==========

    function testRegisterUser() public {
        vm.prank(kycManager);
        vm.expectEmit(true, false, false, true);
        emit UserRegistered(user1, KYC_ID_1);
        
        platform.registerUser(user1, KYC_ID_1);

        (bool kycVerified, , , , , ) = platform.getUserDetails(user1);
        assertEq(kycVerified, true);
        assertEq(platform.kycIdToAddress(KYC_ID_1), user1);
    }

    function testRegisterUserFailsWithInvalidAddress() public {
        vm.prank(kycManager);
        vm.expectRevert("Invalid user address");
        platform.registerUser(address(0), KYC_ID_1);
    }

    function testRegisterUserFailsWithEmptyKycId() public {
        vm.prank(kycManager);
        vm.expectRevert("Invalid KYC ID");
        platform.registerUser(user1, "");
    }

    function testRegisterUserFailsWhenAlreadyRegistered() public {
        address temporal = address(0x123);
        vm.startPrank(kycManager);
        platform.registerUser(temporal, KYC_ID_1);

        console.log("User1 registered with KYC ID:", KYC_ID_1);
        
        
        vm.expectRevert("User already registered");
        platform.registerUser(temporal, KYC_ID_2);
        vm.stopPrank();
    }

    function testRegisterUserFailsWithDuplicateKycId() public {
        vm.startPrank(kycManager);
        platform.registerUser(user1, KYC_ID_1);
        
        vm.expectRevert("KYC ID already used");
        platform.registerUser(user2, KYC_ID_1);
        vm.stopPrank();
    }

    function testRegisterUserFailsWithoutKycRole() public {
        vm.prank(user1);
        vm.expectRevert();
        platform.registerUser(user1, KYC_ID_1);
    }
}