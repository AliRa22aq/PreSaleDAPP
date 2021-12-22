// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";


contract PancakeRouter {

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'PancakeRouter: EXPIRED');
        _;
    }


    receive() external payable {
        // assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }


    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity) {

        require(token != address(0), "no null address allowed");
        require(amountTokenDesired >= 0, "no null address allowed");
        require(amountTokenMin >= 0, "no null address allowed");
        require(amountETHMin >= 0, "no null address allowed");
        require(to != address(0), "no null address allowed");


        bool transfer = IERC20(token).transferFrom(msg.sender, address(this), amountTokenDesired );
        require( transfer, "Unable to transfer presale tokens to the contract");


        (amountToken, amountETH, liquidity) = (1,2,3);


    }



}
