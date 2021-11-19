//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import './IUniswapV2Factory.sol';
import './IUniswapV2Pair.sol';
import './IUniswapV2Router02.sol';

contract UniswapLP {

    address UniswapV2Factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address UniswapV2Router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

  function getPair(address tokenA, address tokenB) public view returns (address){
    address pairAddr = IUniswapV2Factory(UniswapV2Factory).getPair(tokenA, tokenB);
    return pairAddr;
  }

  function createPair(address tokenA, address tokenB) public returns (address){
    address pairAddr = IUniswapV2Factory(UniswapV2Factory).createPair(tokenA, tokenB);
    return pairAddr;
  }

  function factory() public pure returns (address){
    address pairAddr = IUniswapV2Router02(UniswapV2Router02).factory();
    return pairAddr;
  }

    function addLiquidity(
        address tokenA, address tokenB,
        uint amountADesired, uint amountBDesired,
        uint amountAMin, uint amountBMin,
        address to, uint deadline
    ) external returns (uint , uint, uint){

        (uint amountA, uint amountB, uint liquidity) = IUniswapV2Router02(UniswapV2Router02).addLiquidity(
            tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline
            );

        return (amountA,  amountB, liquidity);
    }
    

}