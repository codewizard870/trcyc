// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 token_decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 _decimals,
        uint256 supply
    ) ERC20(name, symbol) {
        _mint(msg.sender, supply);
        token_decimals = _decimals;
    }

    function decimals() public view override returns(uint8){
        return token_decimals;
    }

    function mintTokens(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
