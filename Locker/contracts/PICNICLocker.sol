// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";


contract PICNICLocker is Ownable {

    using SafeMath for uint;
    uint public lockCount;    
    uint public lockFee = 0.1 ether;
    uint public updateLokcerFee = 0.05 ether;

    mapping(uint => LockedToken)  public lockedToken;
    mapping(address => uint[])  locksByUserTokenList;
    mapping(address => uint[])  locksByUserList;

    enum Status {LOCKED, WITHDRAWED}

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

    modifier OnlyLockerOnwer(uint _id) {
        require(lockedToken[_id].owner == msg.sender, "Only locker onwer is allowed"); 
        _;
    }

    modifier NotExpired(uint _id) {
        require(block.timestamp < lockedToken[_id].unlockTime, "Not unlocked yet");
        _;
    }

    function lockTokens(address _token, uint _numOfTokens, uint _unlockTime) payable public {
        require(msg.value >= lockFee, "please pay the fee");
        require(_unlockTime > block.timestamp, "please pay the fee");

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


    function unlockTokens(uint _id, uint _numOfTokens) public OnlyLockerOnwer(_id){

        // require(lockedToken[_id].owner == msg.sender, "Only owner of the lock can unlock"); 
        // require(block.timestamp >= lockedToken[_id].unlockTime, "Not unlocked yet");
        require(lockedToken[_id].numOfTokens >= _numOfTokens, "Not enough tokens to withdraw");

        lockedToken[_id].numOfTokens = lockedToken[_id].numOfTokens.sub(_numOfTokens);

        if(lockedToken[_id].numOfTokens == 0 ){
            lockedToken[_id].status = Status.WITHDRAWED;
        }

    }

    function addTokenstoALocker(uint _id, uint _numOfTokens) payable public OnlyLockerOnwer(_id) NotExpired(_id) {

        require(msg.value >= updateLokcerFee, "please pay the updating fee");
        require(_numOfTokens > 0, "Tokens should be more than zero");
        require(lockedToken[_id].status != Status.WITHDRAWED, "NO more tokens present. Kindly start anothre locker");

        IERC20(lockedToken[_id].token).transferFrom(msg.sender, address(this), _numOfTokens);

        lockedToken[_id].numOfTokens = lockedToken[_id].numOfTokens.add(_numOfTokens);

    }

    function increaseLocktime(uint _id, uint _additionTime) payable public OnlyLockerOnwer(_id) NotExpired(_id) {

        require(msg.value >= updateLokcerFee, "please pay the updating fee");
        require(lockedToken[_id].status != Status.WITHDRAWED, "NO more tokens present. Kindly start anothre locker");

        lockedToken[_id].unlockTime = lockedToken[_id].unlockTime.add(_additionTime);

    }


    function getLockersListbyUser(address _userAddress) public view returns (uint[] memory) {
        return locksByUserList[_userAddress];
    }

    function getLockersListbyToken(address _tokenAddress) public view returns (uint[] memory) {
        return locksByUserTokenList[_tokenAddress];
    }

    function updateFees(uint _lockFee, uint _updatingFee) public onlyOwner {
        lockFee = _lockFee;
        updateLokcerFee = _updatingFee;
    }

    function balanceOfContract() public view returns (uint) {
        return address(this).balance;
    }
}