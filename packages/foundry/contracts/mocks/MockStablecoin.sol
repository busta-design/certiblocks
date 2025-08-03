// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockStablecoin
 * @dev Simula un stablecoin como USDC/USDT para pruebas locales
 */
contract MockStablecoin is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        // Puedes emitir tokens aquí si quieres
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    /**
     * @dev Permite emitir tokens a cualquier dirección (solo para pruebas)
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @dev Override para simular 6 decimales (como USDC real)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
