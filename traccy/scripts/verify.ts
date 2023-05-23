const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    address: "0xC566F4a74518b3A8cB74Cbb84718E081687017EC",
    constructorArguments: [],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })