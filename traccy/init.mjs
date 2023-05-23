import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

const PAYMENT = JSON.parse(
  fs.readFileSync("./artifacts/contracts/payment.sol/PaymentContract.json")
);
const ERC20 = JSON.parse(
  fs.readFileSync("./artifacts/contracts/utils/MockERC20.sol/MockERC20.json")
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
  const TRCYC_CONTRACT = "0x131C6A669e275c0B10d565c7F7c319B89450dbf2";

  const provider = new ethers.providers.JsonRpcProvider(
    CHAINS_CONFIG.avax_mainnet.rpc
  );
  const signer = new ethers.Wallet(pk, provider);
  const paymentContract = new ethers.Contract(PAYMENT_CONTRACT, PAYMENT.abi, signer);
  const trcycContract = new ethers.Contract(TRCYC_CONTRACT, ERC20.abi, signer);

  let res;
  res = await trcycContract.increaseAllowance(paymentContract.address, "25000000000000000000000");
  console.log(res);

  res = await trcycContract.allowance(signer.address, paymentContract.address);
  console.log(signer.address, paymentContract.address, res.toString())
}
main();
