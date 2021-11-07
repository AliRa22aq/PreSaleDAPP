// SPDX-License-Identifier: MIT


pragma solidity 0.8.6;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract Escrow {

  using SafeMath for uint256;

  address payable admin;
  uint256 public totalBalance;
  uint256 private earnedBalance;
  uint private fee=5;
  

 

  struct Transaction {
    address payable buyer;
    uint256 amount;
    bool locked;
    bool spent;
  }
  // buyer => transaction ID => transaction struct
  mapping(address => mapping(uint => Transaction)) public balances;

  modifier onlyAdmin {
    require(msg.sender == admin, "Only admin can unlock escrow.");
    _;
  }

  constructor() {
    admin = payable(msg.sender);
  }

  // seller accepts a trade, erc20 tokens
  // get moved to the escrow (this contract)
  function accept(uint _tx_id, address payable _buyer, uint256 _amount) external payable returns (uint256) {
   require(msg.value == _amount,"Incorrect amount");
    totalBalance += _amount;
    balances[msg.sender][_tx_id].amount = _amount;
    balances[msg.sender][_tx_id].buyer = _buyer;
    balances[msg.sender][_tx_id].locked = true;
    balances[msg.sender][_tx_id].spent = false;
    return address(this).balance;
  }

  // retrieve current state of transaction in escrow
  function transaction(address _seller, uint _tx_id) external view returns (uint256, bool, address) {
    return ( balances[_seller][_tx_id].amount, balances[_seller][_tx_id].locked, balances[_seller][_tx_id].buyer);
  }

  // admin unlocks tokens in escrow for a transaction
  function release(uint _tx_id, address _seller) onlyAdmin external returns(bool) {
    balances[_seller][_tx_id].locked = false;
    return true;
  }

  // seller is able to withdraw unlocked tokens
  function withdraw(uint _tx_id) external returns(bool) {
    require(balances[msg.sender][_tx_id].locked == false, 'This escrow is still locked');
    require(balances[msg.sender][_tx_id].spent == false, 'Already withdrawn');
    address payable payee=payable(msg.sender);
    uint calculateFee=fee.mul(balances[msg.sender][_tx_id].amount).div(100);
    earnedBalance=earnedBalance.add(calculateFee);
    
    payee.transfer((balances[msg.sender][_tx_id].amount).sub(calculateFee));
    admin.transfer(calculateFee);

    totalBalance -= balances[msg.sender][_tx_id].amount;
    balances[msg.sender][_tx_id].spent = true;
    return true;
  }

  // admin can send funds to buyer if dispute resolution is in buyer's favor
  function resolveToBuyer(address _seller, uint _tx_id) onlyAdmin external returns(bool) {
    
    (balances[_seller][_tx_id].buyer).transfer(balances[msg.sender][_tx_id].amount);

    balances[_seller][_tx_id].spent = true;
    totalBalance -= balances[_seller][_tx_id].amount;
    return true;
    
  }
  
  function changeFee(uint newFee) public onlyAdmin{
      fee=newFee;
  }
  
  function viewEarning() public view onlyAdmin returns(uint earning){
    return earnedBalance;
  } 
  


}