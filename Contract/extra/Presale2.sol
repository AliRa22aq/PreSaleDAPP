//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import '@almanack/pancake-swap-core/contracts/PancakeFactory.sol';
// import "./SafeMath.sol";
// import "./Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


// interface IERC20 {
//     function name() external view returns (string memory);
//     function symbol() external view returns (string memory);
//     function totalSupply() external view returns (uint256);
//     function balanceOf(address account) external view returns (uint256);
//     function transfer(address recipient, uint256 amount) external returns (bool);
//     function allowance(address owner, address spender) external view returns (uint256);
//     function approve(address spender, uint256 amount) external returns (bool);
//     function transferFrom( address sender, address recipient, uint256 amount) external returns (bool);
// }

// interface IFactory {
//     //   function getPair(address tokenA, address tokenB) external view returns (address pair);
//       function createPair(address tokenA, address tokenB) external returns (address pair);
//     }

// interface IRouter {
//     // function factory() external pure returns (address);

//     function addLiquidity(
//         address tokenA,
//         address tokenB,
//         uint amountADesired,
//         uint amountBDesired,
//         uint amountAMin,
//         uint amountBMin,
//         address to,
//         uint deadline
//     ) external returns (uint amountA, uint amountB, uint liquidity);
// }

contract Presale is Ownable {

    using SafeMath for uint256;
    
    uint count = 0;
    
    address public criteriaTokenAddr = 0x389D2dD45878afb0284e5Ec1B63ec38967428A30;
    address public devTeamAddr = 0x655181991a7310880485250DccDD376000b74a9B;
    
    //# PancakeSwap on BSC mainnet
    // address pancakeSwapFactoryAddr = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    // address pancakeSwapRouterAddr = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    
    
    //# PancakeSwap on BSC testnet:
    address pancakeSwapFactoryAddr = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;
    address pancakeSwapRouterAddr = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;

    //# BNB address
    address BNBAddr = 0xB8c77482e45F1F44dE1745F52C74426C631bDD52;
    

    mapping(uint256 => PresaleContract) public presaleContract;
    mapping(uint256 => PresaleContractStatic) public presaleContractStatic;
    mapping(uint256 => mapping(address => Partipant)) public participant;

    // enum PoolType{ UNI, PCS }
    enum PreSaleStatus {paused, inProgress, succeed, failed}
    
    struct Partipant {
        uint256 value;
        uint256 tokens;
    }
    
    
    struct PresaleContractStatic {
        address preSaleContractAddr;
        string symbol;
        string name;
        address pairAddress;
        PreSaleStatus preSaleStatus;
        uint256 countOfParticipants;
    }
    
    struct PresaleContract {
        // id
        // uint256 presaleId;
        
        // Contract Info
        address preSaleContractAddr;
        
        // Token distribution
        uint256 reservedTokensPCForLP;      // 70% = 0.7   =>   1700/1.7 = 700
        uint256 tokensForSale;              // 1000
        uint256 remainingTokensForSale;
        uint256 accumulatedBalance;

        // Participation Criteria
        uint256 priceOfEachToken;
        uint256 minTokensForParticipation;
        uint256 minContibution;
        uint256 maxContibution;
        uint256 softCap;
        uint256 startedAt;
        uint256 expiredAt;
        
    }
    
    
    function setPresaleContractInfo(
        // Contract Info
        address _preSaleContractAddress,

        uint8 _reservedTokensPCForLP,
        uint256 _tokensForSale,

        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        uint256 _minContibution,
        uint256 _maxContibution,
        uint256 _softCap,
        uint256 _startedAt,
        uint256 _expiredAt

        ) public onlyOwner returns(uint){


        count++;
        
        address _address = IFactory(pancakeSwapFactoryAddr).createPair(_preSaleContractAddress, BNBAddr);

        presaleContractStatic[count] = PresaleContractStatic(
            _preSaleContractAddress,
            IERC20(_preSaleContractAddress).symbol(),
            IERC20(_preSaleContractAddress).name(),
            _address,
            PreSaleStatus.inProgress,
            0
        );
        
        presaleContract[count] = PresaleContract(
            _preSaleContractAddress,
            
            // Token distribution
            _reservedTokensPCForLP,             // 70% = 0.7   =>   1700/1.7 = 700
            _tokensForSale,                     // 1000    tokensForSale
            _tokensForSale,                     // remainingTokensForSale = tokensForSale (initially)
            0,                                  // accumulatedBalance

            // Participation Criteria
            _priceOfEachToken,
            _minTokensForParticipation,
            _minContibution,
            _maxContibution,
            _softCap,
            _startedAt,
            _expiredAt
            
        );

        return count;
    }
    
    function getLatestPresaleContractStaticInfo() public view returns(PresaleContractStatic memory){
        return presaleContractStatic[count];
    }
    
    function getLatestPresaleContractInfo() public view returns(PresaleContract memory){
        return presaleContract[count];
    }
    
    function updatePresaleContractInfo (
        uint256 _id, // id
        
        
        uint8 _reservedTokensPCForLP,
        uint256 _tokensForSale,
            
        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        uint256 _minContibution,      
        uint256 _maxContibution,
        uint256 _softCap,
        uint256 _startedAt,
        uint256 _expiredAt

        ) public onlyOwner returns(PresaleContract memory){

        PresaleContract memory currentProject = presaleContract[_id];

        presaleContract[_id]  = PresaleContract(
            // _id,
            currentProject.preSaleContractAddr,
            
            // Token distribution
            _reservedTokensPCForLP,                     // 70% = 0.7   =>   1700/1.7 = 700
            _tokensForSale,                             // 1000    tokensForSale
            _tokensForSale,                             // remainingTokensForSale = tokensForSale (initially)
            currentProject.accumulatedBalance,          // accumulatedBalance
            
            // Participation Criteria
            _priceOfEachToken,
            _minTokensForParticipation,
            _minContibution,
            _maxContibution,
            _softCap,
            _startedAt,
            _expiredAt
            // currentProject.countOfParticipants
        );
            
        
        return presaleContract[_id];
    }

    function deletePresaleContractInfo (uint256 _id) public onlyOwner returns(bool){
        delete presaleContract[_id];
        delete presaleContractStatic[_id];

        return true;
    }


    function buyTokensOnPresale(uint256 _id, uint256 _numOfTokensRequested) payable public returns (bool){

        require(presaleContractStatic[_id].preSaleStatus == PreSaleStatus.inProgress, "Presale is not in progress");
        
        //require(block.timestamp > presaleContract[_id].startedAt, "Presale hasn't begin yet. please wait");
        //require(block.timestamp < presaleContract[_id].expiredAt, "Presale is over. Try next time");

        // require(presaleContract[_id].remainingTokensForSale <= IERC20(presaleContract[_id].preSaleContractAddr).balanceOf(address(this)), "insufficient tokens to fulfill this order");
        
        //require(_numOfTokensRequested <= presaleContract[_id].remainingTokensForSale, "insufficient tokens to fulfill this order");
        //require(msg.value >= _numOfTokensRequested*presaleContract[_id].priceOfEachToken, "insufficient funds");

        uint256 PICNICTokensOfUser = IERC20(criteriaTokenAddr).balanceOf(msg.sender);
        require(PICNICTokensOfUser >= presaleContract[_id].minTokensForParticipation, "Not enough tokens to participate. Should be atleast 250");
        
    
        //require(_numOfTokensRequested >= presaleContract[_id].minContibution, "Contribution is low, Please request more than minimum contribution");
        //require(_numOfTokensRequested + IERC20(presaleContract[_id].preSaleContractAddr).balanceOf(address(msg.sender)) <= presaleContract[_id].maxContibution, "Contribution is high, Please request less than maximum contribution");

            presaleContractStatic[_id].countOfParticipants++;
            presaleContract[_id].accumulatedBalance += msg.value;
            presaleContract[_id].remainingTokensForSale -= _numOfTokensRequested;
            participant[_id][msg.sender] = Partipant(msg.value, _numOfTokensRequested);
            
            
            return true;

    }
    
    function claimTokensOrRefund(uint _id) public {
        
        PreSaleStatus _status = presaleContractStatic[_id].preSaleStatus;
        //require( _status != PreSaleStatus.paused, "You can't claim your tokens/refund at the moment");
        //require(_status != PreSaleStatus.inProgress, "Presale is still in progress");
        

        require( presaleContract[_id].preSaleContractAddr != address(0), "project does not exist");
        
        
        Partipant memory _participant = participant[_id][msg.sender];
        

        if (_status == PreSaleStatus.succeed){
            require(_participant.tokens > 0, "No tokens to claim");        
            bool tokenDistribution = IERC20(presaleContract[_id].preSaleContractAddr).transfer(address(msg.sender), _participant.tokens);
            require(tokenDistribution, "Unable to transfer tokens to the participant");
            participant[_id][msg.sender] = Partipant(0, 0);
        }
        else if(_status == PreSaleStatus.failed){
            require(_participant.value > 0, "No amount to refund");        
            bool refund = payable(msg.sender).send(_participant.value);
            require(refund, "Unable to refund amount to the participant");
            participant[_id][msg.sender] = Partipant(0, 0);
        }

    }
    
        
    function endPresale(uint _id) public onlyOwner returns (uint, uint, uint){
        
        require( presaleContract[_id].preSaleContractAddr != address(0), "project does not exist");

        PresaleContract memory currentProject = presaleContract[_id];
        
        //require(block.timestamp > currentProject.expiredAt, "Presale is not over yet");
        
        uint256 totalTokensSold = currentProject.tokensForSale - currentProject.remainingTokensForSale;
        
        // successful presale
        if( totalTokensSold >= currentProject.softCap ){
            presaleContractStatic[_id].preSaleStatus = PreSaleStatus.succeed;
            
            uint256 revenueFromPresale = currentProject.accumulatedBalance;
            require(revenueFromPresale > 0, "No revenue to add liquidity");
            
            uint256 tokensToAddLiquidity = totalTokensSold.mul(currentProject.reservedTokensPCForLP).div(100);
            uint256 poolShareBNB = revenueFromPresale.mul(currentProject.reservedTokensPCForLP).div(100);
            uint256 devTeamShareBNB = revenueFromPresale.sub(poolShareBNB);
            
            (bool devTeam) = payable(devTeamAddr).send(devTeamShareBNB);
            require(devTeam, "cannot send dev's share");
            
            // PoolType _poolType =  presaleContractStatic[_id]._poolType;

            // Approval
            require(tokensToAddLiquidity > 1000, "tokensToAddLiquidity less than 1000");
            require(poolShareBNB > 1000, "tokensToAddLiquidity less than 1000");


            IERC20(currentProject.preSaleContractAddr).approve(pancakeSwapRouterAddr, tokensToAddLiquidity);
            IERC20(BNBAddr).approve(pancakeSwapRouterAddr, poolShareBNB);

            (uint amountA, uint amountB, uint liquidity) = IRouter(pancakeSwapRouterAddr).addLiquidity(
                    currentProject.preSaleContractAddr,
                    BNBAddr,
                    poolShareBNB,
                    tokensToAddLiquidity,
                    poolShareBNB,
                    tokensToAddLiquidity,
                    devTeamAddr,
                    block.timestamp + 5*60
                );
            
            currentProject.accumulatedBalance = 0;
            
            return (amountA, amountB, liquidity);
            
        }
        else {
            presaleContractStatic[_id].preSaleStatus = PreSaleStatus.failed;
            return (0,0,0);
        }
        
    }

    function BNBbalanceOfContract() public view onlyOwner returns(uint){
        return address(this).balance;  
    }

    function updatePresaleTime(uint _id, uint _starttime, uint _endTime) public onlyOwner{
        presaleContract[_id].startedAt = _starttime;
        presaleContract[_id].expiredAt = _endTime;
    }
    
    function setCriteriaToken(address _criteriaToken) public onlyOwner {
        criteriaTokenAddr = _criteriaToken;
    }
    
    function setDevTeamAddr(address _devTeamAddr) public onlyOwner {
        devTeamAddr = _devTeamAddr;
    }
        
    // Helping functions;
    function preSaleTokenBalanceOfContract (uint256 _id) public view returns(uint256){
        return IERC20(presaleContract[_id].preSaleContractAddr).balanceOf(address(this));
    }
    
    function preSaleTokenBalanceOfUser (uint256 _id) public view returns(uint256){
        return IERC20(presaleContract[_id].preSaleContractAddr).balanceOf(address(msg.sender));
    }
    function PICNICBalanceOfUser() public view returns (uint){
        return IERC20(criteriaTokenAddr).balanceOf(address(msg.sender));
    }
    

}
