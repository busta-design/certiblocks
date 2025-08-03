# 🏗 Scaffold-ETH 2

## 📖 Descripción general

Este repositorio contiene tres contratos inteligentes en Solidity para una plataforma de inversión descentralizada (DeFi) con gestión de KYC, perfiles de riesgo y estrategias de inversión conservadoras. Incluye:

* **InvestmentPlatform.sol**: Contrato principal que maneja el registro y verificación de usuarios, depósitos en moneda FIAT (BOB), conversión a stablecoins (USDC/USDT), asignación de perfiles de riesgo y ejecución de inversiones.
* **ConservativeStrategy.sol**: Estrategia de inversión conservadora con lockup de 6 meses que simula la asignación de fondos en protocolos de lending como Aave o Compound.
* **MockStablecoin.sol**: Token ERC20 de prueba que simula un stablecoin de 6 decimales (mUSDC) para entornos de desarrollo y test.

## 🛠 Requisitos

* Solidity ^0.8.20
* Hardhat o Foundry para compilación y pruebas
* Node.js ≥ v16
* Una wallet Ethereum (por ejemplo, MetaMask) configurada con testnet (Goerli, Sepolia)

## 🚀 Instalación y despliegue

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu_usuario/defi-investment-platform.git
   cd defi-investment-platform
   ```
2. Instala dependencias:

   ```bash
   npm install
   ```
3. Configura las redes en `hardhat.config.js` o `foundry.toml` con claves privadas y RPC URLs.
4. Despliega:

   ```bash
   npx hardhat run scripts/deploy.js --network goerli
   ```

## ⚙️ Uso y ejemplos

1. **Desplegar MockStablecoin** para pruebas locales:

   ```js
   const Mock = await ethers.getContractFactory("MockStablecoin");
   const mock = await Mock.deploy();
   await mock.deployed();
   ```
2. **Desplegar InvestmentPlatform**:

   ```js
   const Platform = await ethers.getContractFactory("InvestmentPlatform");
   const platform = await Platform.deploy(
     treasuryWallet.address,
     mock.address,
     ethers.utils.parseUnits("1000", 0) // umbral FIAT en BOB
   );
   ```
3. **Registrar y verificar usuario**:

   ```js
   await platform.registerUser(user.address, "KYC123");
   await platform.verifyKYC(user.address);
   ```
4. **Depositar FIAT y convertir a tokens**:

   ```js
   await platform.recordFiatDeposit(user.address, 50000);
   // Simular conversión off-chain y ejecutar:
   await platform.executeFiatToTokenConversion(ethers.utils.parseUnits("50", 6), RATE);
   await platform.convertUserBalance(user.address);
   ```
5. **Crear estrategia conservadora e invertir**:

   ```js
   await platform.createStrategy("Conservador", conservative.address, 0, 180 * 24 * 3600);
   await platform.investUserFunds(user.address, 0);
   ```

## 📄 Documentación de contratos

---

### 1. InvestmentPlatform.sol

**Hereda**: `AccessControl`, `ReentrancyGuard`, `Pausable`
**Roles**:

* `DEFAULT_ADMIN_ROLE`
* `KYC_MANAGER_ROLE` ⚙️ Gestiona registros y verificación KYC
* `INVESTMENT_MANAGER_ROLE` 💼 Crea estrategias e invierte fondos
* `TREASURY_ROLE` 🏦 Registra depósitos FIAT y ejecuta conversiones

**Estructuras**:

* `enum RiskProfile { CONSERVATIVE, MODERATE, AGGRESSIVE }`
* `struct Strategy { string name; address strategyAddress; RiskProfile riskProfile; uint256 lockupPeriod; bool active; }`
* `struct User { bool kycVerified; RiskProfile riskProfile; uint256 fiatBalance; uint256 tokenBalance; uint256 lockedUntil; uint256 currentStrategyId; }`

**Eventos clave**:

* `UserRegistered(user, kycId)`
* `KYCVerified(user)`
* `FiatDeposited(user, amount)`
* `TokensConverted(totalFiat, totalTokens, rate)`
* `StrategyCreated(id, name, profile)`
* `FundsInvested(strategyId, amount)`
* `WithdrawalRequested(user, amount)`
* `EmergencyWithdraw(user, amount)`

**Funciones principales**:

* `registerUser(address, string)`
* `verifyKYC(address)`
* `updateRiskProfile(address, RiskProfile)`
* `recordFiatDeposit(address, uint256)` → convoca `_requestTokenConversion()` si se alcanza umbral
* `executeFiatToTokenConversion(uint256 totalTokens, uint256 rate)`
* `convertUserBalance(address)`
* `createStrategy(string, address, RiskProfile, uint256)`
* `investUserFunds(address, uint256)`
* `requestWithdrawal(uint256)`
* `emergencyWithdraw()`
* `pause()` / `unpause()`
* `getUserDetails(address) returns (...)`

**Seguridad**:

* Uso de `nonReentrant` en funciones críticas
* Pausable para emergencias
* Control de acceso con `AccessControl`

---

### 2. ConservativeStrategy.sol

**Hereda**: `Ownable`, `ReentrancyGuard`
**Propósito**: Simula inversión en protocolos de lending para perfiles conservadores.

**Estructura**:

* `struct Investment { uint256 amount; uint256 startTime; uint256 expectedReturn; }`

**Eventos**:

* `FundsReceived(amount, timestamp)`
* `FundsInvested(protocol, amount)`
* `ReturnsGenerated(amount)`
* `FundsWithdrawn(to, amount)`

**Variables de estado**:

* `IERC20 stablecoin`
* `address investmentPlatform`
* `uint256 totalInvested, totalReturns, targetAPY`
* `mapping(address => Investment) investments`
* `address aavePool, compoundPool`

**Funciones clave**:

* `receiveFunds() external onlyPlatform returns (uint256)` → recibe y reinvierte
* `_investFunds(uint256) private` → simula distribución entre protocols
* `calculateReturns(uint256 principal, uint256 duration) public view returns (uint256)`
* `withdrawToUser(uint256, address) external onlyPlatform`
* `updateProtocols(address, address) external onlyOwner`
* `updateTargetAPY(uint256) external onlyOwner`
* `emergencyWithdraw(address token, uint256 amount) external onlyOwner`
* `getPerformanceMetrics() external view returns (...)`

---

### 3. MockStablecoin.sol

**Hereda**: `ERC20`
**Propósito**: Token de prueba con 6 decimales para simular USDC/USDT.

**Constructor**:

* Emite 1 000 000 mUSDC al desplegador.

**Funciones**:

* `mint(address to, uint256 amount) external` → emisión bajo demanda en tests.
* `decimals() public pure override returns (uint8)` → fija 6 decimales.

---

## 🔐 Consideraciones de seguridad

* Asegurarse de custodiar claves de roles (`DEFAULT_ADMIN_ROLE`, `TREASURY_ROLE`).
* Validar y monitorear conversiones off-chain de FIAT para evitar discrepancias.
* Revisar gas y límites de bloque garantizando que `strategyCounter` no desborde.


![alt text](./img/image.png)


## Direcciones de los contratos desplegados
| Contrato                | Dirección (Sepolia)                     |
|-------------------------|-----------------------------------------|
| InvestmentPlatform      | 0x14d5B536dE6e0c4D78D697385028062AF4575D2d |
| ConservativeStrategy    | 0x08eDd01f987bEAF8E3F40EFe7b9851d123872B45 |
| MockStablecoin          | 0xA62c41355c71428B394bf79243017129bb9792c1 |



| Contrato                | Dirección (Arbitrum sepolia)                     |
|-------------------------|-----------------------------------------|
| InvestmentPlatform      | 0x7B03044c0A61a985831ee6A1D32A3F9E997Cc045 |
| ConservativeStrategy    | 0xF28fE726e4990162002a3c66eF9A68c6B6bF918a |
| MockStablecoin          | 0x6d680657d719378cc0f6a8195c4bd7ECEEdfD6C2 |
