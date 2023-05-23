/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
// import "@oasisprotocol/sapphire-hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "dotenv/config";

import "@nomiclabs/hardhat-etherscan";

const AvaxMainNet: NetworkUserConfig = {
  url: "https://1rpc.io/avax/c",
  chainId: 43114,
  accounts: [process.env.PK!],
};

const AvaxTestNet: NetworkUserConfig = {
  url: "https://rpc.ankr.com/avalanche_fuji",
  chainId: 43113,
  accounts: [process.env.PK!],
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gas: 120000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
    },
    testnet: AvaxTestNet,
    mainnet: AvaxMainNet,
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "metadata"],
        },
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
  etherscan: {
    // apiKey: "QR2YIYFA919M449I4W9R31Z28TXN79IEQP",
    apiKey: "BWHQHBF1A42S5DI4P1SSSEU36PGKXBNV8V"
  },
};

export default config;
