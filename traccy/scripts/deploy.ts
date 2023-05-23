import { ethers, network } from "hardhat";

const currentNetwork = network.name;
console.log(currentNetwork);

const main = async () => {
  const Payment = await ethers.getContractFactory("PaymentContract");
  const contract = await Payment.deploy();
  await contract.deployed();
  console.log("Payment deployed to:", contract.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
