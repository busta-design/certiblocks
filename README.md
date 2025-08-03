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

## 📞 Contacto





<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Foundry, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Foundry. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/foundry/foundry.toml`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/foundry/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/foundry/script` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn foundry:test`

- Edit your smart contracts in `packages/foundry/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/foundry/script`


## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.


![alt text](./img/image.png)
