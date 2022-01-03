// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPLock {

    event Locked (uint id, address owner, address token, uint numOfTokens, uint unlockTime);
    event Unlocked (uint id, address owner, address token, uint numOfTokens);

    function unlockTokens(uint _numOfTokens) external;

    function addTokenstoALocker(uint _numOfTokens) external;
    
    function increaseLocktime(uint _additionTime) external;

}