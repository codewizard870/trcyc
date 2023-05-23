const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    address: "0xDB4Eb8a105A20B9070ba292AD897d2d81483CD07",
    constructorArguments: [],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })