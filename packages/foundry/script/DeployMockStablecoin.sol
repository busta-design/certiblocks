// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {MockStablecoin} from "../contracts/mocks/MockStablecoin.sol";

contract DeployMockStablecoin is Script {
    function run() external {
        vm.startBroadcast();
        MockStablecoin mock = new MockStablecoin();
        console.log("MockStablecoin deployed at:", address(mock));
        vm.stopBroadcast();
    }
}
