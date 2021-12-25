// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/structs/EnumerableSet.sol)

pragma solidity ^0.8.0;

import "./library/EnumerableSet.sol";

abstract contract SalesTracker {

    using EnumerableSet for EnumerableSet.UintSet;
    EnumerableSet.UintSet private activeSalves;

    function addActiveSale(uint256 value) internal returns (bool) {
        return EnumerableSet.add(activeSalves, value);
    }

    function removeActiveSale(uint256 value) internal returns (bool) {
        return EnumerableSet.remove(activeSalves, value);
    }

    function containsActiveSale(uint256 value) public view returns (bool) {
        return EnumerableSet.contains(activeSalves, value);    
    }

    function activeSalesCount() public view returns (uint256) {
        return EnumerableSet.length(activeSalves);
    }

    function activeSalesList() public view returns (bytes32[] memory) {
        return activeSalves._inner._values;
    }

}