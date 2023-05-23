import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

const PAYMENT_ABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/payment.sol/payment.json")
);
dotenv.config();

const CHAINS_CONFIG = {
  avax_mainnet: {
    chainId: "0xa86a",
    chainName: "Avalanche C-Chain",
    rpc: "https://1rpc.io/avax/c",
  },
  avax_testnet: {
    chainId: "0xa869",
    chainName: "Avalanche Fuji Testnet",
    rpc: "https://rpc.ankr.com/avalanche_fuji"
  }
};

const pk = process.env.PK;

async function main() {
  if (!pk) return;

  const PAYMENT_CONTRACT = "0xC566F4a74518b3A8cB74Cbb84718E081687017EC";

  const provider = new ethers.providers.JsonRpcProvider(
    CHAINS_CONFIG.avax_testnet.rpc
  );
  const signer = new ethers.Wallet(pk, provider);
  const contract = new ethers.Contract(PAYMENT_CONTRACT, PAYMENT_ABI.abi, signer);

  let res;
}
main();
