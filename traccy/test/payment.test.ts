import { formatEther, parseEther } from "ethers/lib/utils";
import { artifacts, contract } from "hardhat";
import { assert, expect } from "chai";
import { BN, constants, expectEvent, expectRevert, time } from "@openzeppelin/test-helpers";

const MockERC20 = artifacts.require("./utils/MockERC20.sol");
const PaymentContract = artifacts.require("./PaymentContract.sol");

const PRICE_BNB = 400;

function gasToBNB(gas: number, gwei = 5) {
  const num = gas * gwei * 10 ** -9;
  return num.toFixed(4);
}

function gasToUSD(gas: number, gwei = 5, priceBNB: number = PRICE_BNB) {
  const num = gas * priceBNB * gwei * 10 ** -9;
  return num.toFixed(2);
}

contract("Payment", ([alice, bob, carol, david, erin, operator, treasury, injector]) => {
  // VARIABLES
  const _totalInitSupply = parseEther("10000");

  // Contracts
  let paymentContract;
  let mockUSDC;
  let mockUSDT;
  let mockTRCYC;

  let result: any;

  const price = 1_250_000;
  before(async () => {
    mockUSDC = await MockERC20.new("USDC", "USDC", 6, _totalInitSupply, { from: bob });
    mockUSDT = await MockERC20.new("USDT", "USDT", 6, _totalInitSupply, { from: bob });
    mockTRCYC = await MockERC20.new("TRCYC", "TRCYC", 18, _totalInitSupply, { from: treasury });

    paymentContract = await PaymentContract.new({ from: alice });
    await paymentContract.SetConfig(price, treasury);
    await paymentContract.SetTokenAddress(mockTRCYC.address, mockUSDC.address, mockUSDT.address);

    await mockTRCYC.increaseAllowance(paymentContract.address, _totalInitSupply, { from: treasury });
  });

  it("buy with USDC from bob", async () => {
    console.log("before")
    console.log("bob's usdc balance : ",(await mockUSDC.balanceOf(bob)).toString())
    console.log("bob's trcyc balance : ",(await mockTRCYC.balanceOf(bob)).toString())

    const amount = 2_520_000
    await mockUSDC.increaseAllowance(paymentContract.address, amount, { from: bob });

    result = await paymentContract.Buy(mockUSDC.address, amount, { from: bob });

    const sent = Math.floor(amount / price) * new BN("1000000000000000000");
    expectEvent(result, "FiatReceived", {
      payer: bob,
      token: mockUSDC.address,
      amount: new BN(amount),
      tokensSent: sent.toString()
    })

    console.log("after")
    console.log("bob's usdc balance : ",(await mockUSDC.balanceOf(bob)).toString())
    console.log("bob's trcyc balance : ",(await mockTRCYC.balanceOf(bob)).toString())
    
  });
});
