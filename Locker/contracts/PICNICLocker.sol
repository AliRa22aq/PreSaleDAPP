// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";


contract PICNICLocker is Ownable {

    using SafeMath for uint;
    uint public lockCount;    
    uint public lockFee = 0.0001 ether;

    mapping(uint => LockedToken)  public lockedToken;
    mapping(address => uint[])  locksByUserTokenList;
    mapping(address => uint[])  locksByUserList;

    enum Status {LOCKED, P_WITHDRAWED, WITHDRAWED}

    struct LockedToken {
        uint id;
        address owner; 
        address token;
        uint numOfTokens;
        uint lockTime;
        uint unlockTime;
        Status status;
    }

    event Locked (uint id, address owner, address token, uint numOfTokens, uint currenttime, uint unlockTime, Status status);
    event Unlocked (uint id, address owner, address token, uint numOfTokens, uint currenttime, uint unlockTime, Status status);

    function lockTokens(address _token, uint _numOfTokens, uint _unlockTime) payable public {
        // require(msg.value >= lockFee, "please pay the fee");

        IERC20(_token).transferFrom(msg.sender, address(this), _numOfTokens);

        lockCount++;

        lockedToken[lockCount] = LockedToken(
            lockCount,
            msg.sender,
            _token,
            _numOfTokens,
            block.timestamp,
            _unlockTime,
            Status.LOCKED
        );

        locksByUserList[msg.sender].push(lockCount);
        locksByUserTokenList[_token].push(lockCount);

        emit Locked (lockCount, msg.sender, _token, _numOfTokens, block.timestamp, _unlockTime, Status.LOCKED);

    }


    function unlockTokens(uint _id, uint _numOfTokens) public {

        require(lockedToken[_id].owner == msg.sender, "Only owner of the lock can unlock"); 
        // require(block.timestamp >= lockedToken[_id].unlockTime, "Not unlocked yet");
        require(lockedToken[_id].numOfTokens >= _numOfTokens, "Not enough tokens to withdraw");

        lockedToken[_id].numOfTokens = lockedToken[_id].numOfTokens.sub(_numOfTokens);

        if(lockedToken[_id].numOfTokens == 0 ){
            lockedToken[_id].status = Status.WITHDRAWED;
        }
        else {
            lockedToken[_id].status = Status.P_WITHDRAWED;
        }

        // LockedToken memory locked = lockedToken[_id];

        // emit Unlocked (
        //     lockCount, 
        //     msg.sender, 
        //     _token, 
        //     _numOfTokens, 
        //     block.timestamp, 
        //     _unlockTime, 
        //     Status.LOCKED
        //     );


    }

    // function getLock(uint _id) public view returns (LockedToken memory){
    //     return lockedToken[_id];
    // }

    function getLocksListbyUser() public view returns (uint[] memory) {
        return locksByUserList[msg.sender];
    }

    function getLocksListbyToken(address _tokenAddress) public view returns (uint[] memory) {
        return locksByUserTokenList[_tokenAddress];
    }

    function updateFee(uint _fee) public onlyOwner {
        lockFee = _fee;
    }

    function balanceOfContract() public view returns (uint) {
        return address(this).balance;
    }
}