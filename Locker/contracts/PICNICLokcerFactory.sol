// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./IPancakePair.sol";
import "./IERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";
import "./PLock.sol";
import "./IPLock.sol";


contract PICNICLockerFactory is Ownable {

    using SafeMath for uint;
    uint public lockerCount;    

    uint public lockFee = 0.1 ether;
    uint public updateLokcerFee = 0.05 ether;

    mapping(uint => Loker)  public loker;
    mapping(address => uint[])  lockersListByTokenAddress;
    mapping(address => uint[])  lockersListByUserAddress;

    enum Status {LOCKED, WITHDRAWED}
    enum Type {TOKEN, LPTOKEN}

    struct Loker {
        uint id;
        Type _type;
        address owner; 
        address tokenAddress;
        address lockerAddress;
        uint numOfTokens;
        uint lockTime;
        uint unlockTime;
        Status status;
    }

    event Locked (uint id, address owner, address token, uint numOfTokens, uint unlockTime);
    event Unlocked (uint id, address owner, address token, uint numOfTokens);

    modifier OnlyLockerOnwer(uint _id) {
        require(loker[_id].owner == _msgSender(), "Only locker onwer is allowed."); 
        _;
    }

    modifier NotExpired(uint _id) {
        require(block.timestamp < loker[_id].unlockTime, "Not unlocked yet.");
        _;
    }

    modifier Expired(uint _id) {
        require(block.timestamp >= loker[_id].unlockTime, "The locker has been expired.");
        _;
    }



    function createLcoker(Type _type, address _token, uint _numOfTokens, uint _unlockTime) payable public {

        require(msg.value >= lockFee, "Please pay the fee");
        require(_unlockTime > block.timestamp, "The unlock time should in future");



        lockerCount++;


        PLock lockerr = new PLock(lockerCount, _msgSender(), _token, _numOfTokens, _unlockTime);

        IERC20(_token).transferFrom(_msgSender(), address(lockerr), _numOfTokens);

        loker[lockerCount] = Loker(
            lockerCount,
            _type,
            _msgSender(),
            _token,
            address(lockerr),
            _numOfTokens,
            block.timestamp,
            _unlockTime,
            Status.LOCKED
        );


        lockersListByUserAddress[_msgSender()].push(lockerCount);
        lockersListByTokenAddress[_token].push(lockerCount);

        emit Locked (lockerCount, _msgSender(), _token, _numOfTokens, _unlockTime );
        
    }

    
    function unlockTokens(uint _id, uint _numOfTokens) public OnlyLockerOnwer(_id) Expired(_id) {

        Loker memory lokerData = loker[_id];
        require(lokerData.numOfTokens >= _numOfTokens, "Not enough tokens to withdraw");

        IPLock(loker[_id].lockerAddress).unlockTokens(_numOfTokens);

        loker[_id].numOfTokens = lokerData.numOfTokens.sub(_numOfTokens);   

        if(loker[_id].numOfTokens == 0 ){
            loker[_id].status = Status.WITHDRAWED;
        }

        emit Unlocked (_id, _msgSender(), lokerData.tokenAddress, _numOfTokens);

    }

    function addTokenstoALocker(uint _id, uint _numOfTokens) payable public OnlyLockerOnwer(_id) NotExpired(_id) {

        require(msg.value >= updateLokcerFee, "Please pay the updating fee");
        require(_numOfTokens > 0, "Tokens should be more than zero");

        IERC20(loker[_id].tokenAddress).transferFrom(_msgSender(), address(loker[_id].lockerAddress), _numOfTokens);
        IPLock(loker[_id].lockerAddress).addTokenstoALocker(_numOfTokens);

        loker[_id].numOfTokens = loker[_id].numOfTokens.add(_numOfTokens);

    }

    function increaseLocktime(uint _id, uint _additionTime) payable public OnlyLockerOnwer(_id) NotExpired(_id) {

        require(msg.value >= updateLokcerFee, "please pay the updating fee");
        require(_additionTime > 0, "Addition time should be more than zero");

        IPLock(loker[_id].lockerAddress).increaseLocktime(_additionTime);

        loker[_id].unlockTime = loker[_id].unlockTime.add(_additionTime);

    }





    function getLockersListbyUser(address _userAddress) public view returns (uint[] memory) {
        return lockersListByUserAddress[_userAddress];
    }

    function getLockersListbyToken(address _tokenAddress) public view returns (uint[] memory) {
        return lockersListByTokenAddress[_tokenAddress];
    }

    function updateFees(uint _lockFee, uint _updatingFee) public onlyOwner {
        lockFee = _lockFee;
        updateLokcerFee = _updatingFee;
    }

    function withdrawFunds() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(_msgSender()).transfer(balance);
    }
}