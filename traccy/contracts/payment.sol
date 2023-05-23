// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract PaymentContract is Ownable{
    event FiatReceived(address indexed payer, address indexed token, uint256 amount, uint256 tokensSent);

    address private TRCYC_ADDRESS;
    address private USDC_ADDRESS;
    address private USDT_ADDRESS;

    uint256 private TOKEN_PRICE;
    address private TREASURY_ADDRESS;

    constructor() {
      TOKEN_PRICE = 1_250_000; //6 decimals
      TREASURY_ADDRESS = 0xCa7f7606853A7D70386B1C854a9A77Fc72195913;

      TRCYC_ADDRESS = 0xC566F4a74518b3A8cB74Cbb84718E081687017EC; //18 decimals
      USDC_ADDRESS = 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E; //6 decimals
      USDT_ADDRESS = 0xc7198437980c041c805A1EDcbA50c1Ce5db95118; //6 decimals
    }
    
    function SetConfig(uint256 price, address treasury) public onlyOwner {
      TOKEN_PRICE = price;
      TREASURY_ADDRESS = treasury;
    }

    function SetTokenAddress(address trcyc, address usdc, address usdt) public onlyOwner {
      TRCYC_ADDRESS = trcyc;
      USDC_ADDRESS = usdc;
      USDT_ADDRESS = usdt;
    }

    function Buy(address token, uint256 amount) public {
        require(msg.sender != address(0), "Invalid sender address");
        require(token == USDC_ADDRESS || token == USDT_ADDRESS, "Invalid Fiat token address");

        address FIAT_ADDRESS = token;
        require(IERC20(FIAT_ADDRESS).balanceOf(msg.sender) >= amount, "Insufficient Fiat token balance");
        require(IERC20(FIAT_ADDRESS).allowance(msg.sender, address(this)) >= amount, "Insufficient Fiat token allowance of Sender");
        
        uint256 trcycAmount = amount / TOKEN_PRICE * (1 ether);
        require(IERC20(TRCYC_ADDRESS).balanceOf(TREASURY_ADDRESS) >= trcycAmount, "Insufficient TRCYC balance");
        require(IERC20(TRCYC_ADDRESS).allowance(TREASURY_ADDRESS, address(this)) >= trcycAmount, "Insufficient TRCYC allowance of Treasury");

        require(IERC20(FIAT_ADDRESS).transferFrom(msg.sender, TREASURY_ADDRESS, amount), "USDC transfer failed");
        require(IERC20(TRCYC_ADDRESS).transferFrom(TREASURY_ADDRESS, msg.sender, trcycAmount), "TRCYC transfer failed");

        emit FiatReceived(msg.sender, FIAT_ADDRESS, amount, trcycAmount);
    }
}