// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./IPancakePair.sol";
import "./IERC20.sol";
import "./Context.sol";
import "./SafeMath.sol";

contract PLock is Context {

    using SafeMath for uint;

    address internal master;
    Loker internal loker;

    enum Status {LOCKED, WITHDRAWED}
    enum Type {TOKEN, LPTOKEN}

    struct Loker {
        uint id;
        address owner; 
        address tokenAddress;
        uint numOfTokens;
        uint lockTime;
        uint unlockTime;
    }

    event Locked (uint id, address owner, address token, uint numOfTokens, uint unlockTime);
    event Unlocked (uint id, address owner, address token, uint numOfTokens);

    modifier onlyMaster() {
        require(msg.sender == master, "Only master is allowed to call."); 
        _;
    }

    modifier NotExpired() {
        require(block.timestamp < loker.unlockTime, "Not unlocked yet.");
        _;
    }

    modifier Expired() {
        require(block.timestamp >= loker.unlockTime, "The locker has been expired.");
        _;
    }

    constructor (
        uint _lockerID, 
        address _owner, 
        address _token, 
        uint _numOfTokens, 
        uint _unlockTime
    ) 
    {
        master = msg.sender;
        loker = Loker(_lockerID, _owner, _token, _numOfTokens, block.timestamp, _unlockTime );
    }


    function unlockTokens(uint _numOfTokens) public Expired onlyMaster{
        IERC20(loker.tokenAddress).transfer(loker.owner, _numOfTokens);
        loker.numOfTokens = loker.numOfTokens.sub(_numOfTokens);   
    }

    function addTokenstoALocker(uint _numOfTokens) public NotExpired onlyMaster{

        require(_numOfTokens > 0, "Tokens should be more than zero");
        loker.numOfTokens = loker.numOfTokens.add(_numOfTokens);

    }

    function increaseLocktime(uint _additionTime) public NotExpired onlyMaster{

        require(_additionTime > 0, "Addition time should be more than zero");
        loker.unlockTime = loker.unlockTime.add(_additionTime);

    }


}