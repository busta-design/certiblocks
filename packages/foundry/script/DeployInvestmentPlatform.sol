// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {InvestmentPlatform} from "../contracts/InvestmentPlatform.sol";
import {ConservativeStrategy} from "../contracts/ConservativeStrategy.sol";
import {MockStablecoin} from "../contracts/mocks/MockStablecoin.sol";

contract DeployInvestmentPlatform is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy mock stablecoin
        MockStablecoin stable = new MockStablecoin();

        // Dirección del treasury (puede ser msg.sender durante pruebas)
        address treasury = msg.sender;

        // Deploy plataforma principal
        InvestmentPlatform platform = new InvestmentPlatform(
            treasury,
            address(stable),
            1000 * 10 ** stable.decimals() // Ej: 1000 BOB
        );

        // Deploy estrategia conservadora
        ConservativeStrategy strategy = new ConservativeStrategy(
            address(stable),
            address(platform),
            msg.sender
        );

        // Crear estrategia desde la plataforma
        platform.grantRole(platform.INVESTMENT_MANAGER_ROLE(), msg.sender);
        platform.createStrategy(
            "Conservative Strategy",
            address(strategy),
            InvestmentPlatform.RiskProfile.CONSERVATIVE,
            180 days // 6 meses
        );

        console.log("InvestmentPlatform:", address(platform));
        console.log("ConservativeStrategy:", address(strategy));
        console.log("MockStablecoin:", address(stable));

        vm.stopBroadcast();
    }
}
