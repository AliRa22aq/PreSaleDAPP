//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./IERC20.sol";
import "./IPancakeRouter02.sol";
import "./IPancakeFactory.sol";

contract Presale is Ownable{

    using SafeMath for uint256;
    
    uint count = 0;
    
    address public criteriaTokenAddr = 0x93F89b55d2F36fF3d2fE7b8C4463a55Dc6687681;
    address public devTeamAddr = 0x655181991a7310880485250DccDD376000b74a9B;
    
    //# PancakeSwap on BSC mainnet
    // address pancakeSwapFactoryAddr = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    // address pancakeSwapRouterAddr = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    
    
    //# PancakeSwap on BSC testnet:
    address pancakeSwapFactoryAddr = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;
    address pancakeSwapRouterAddr = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;

    //# BNB address
    address WBNBAddr = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
    

    mapping(uint256 => PresaleContract) public presaleContract;
    mapping(uint256 => PresaleContractStatic) public presaleContractStatic;
    mapping(uint256 => InternalData) public internalData;

    mapping(uint256 => mapping(address => Partipant)) public participant;

    enum PreSaleStatus {paused, inProgress, succeed, failed}

    struct InternalData { 
        uint totalTokensSold;
        uint revenueFromPresale;
        uint tokensToAddLiquidity;
        uint poolShareBNB;
        uint devTeamShareBNB;
        bool approval;
    }

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
        
        address _address = IPancakeFactory(pancakeSwapFactoryAddr).createPair(_preSaleContractAddress, WBNBAddr);

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

        // uint256 PICNICTokensOfUser = IERC20(criteriaTokenAddr).balanceOf(msg.sender);
        // require(PICNICTokensOfUser >= presaleContract[_id].minTokensForParticipation, "Not enough tokens to participate. Should be atleast 250");
        
    
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
        require( _status != PreSaleStatus.paused, "You can't claim your tokens/refund at the moment");
        require(_status != PreSaleStatus.inProgress, "Presale is still in progress");
        

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
        
        uint256 totalTokensSold = currentProject.tokensForSale.sub(currentProject.remainingTokensForSale);
        
        require(totalTokensSold >= currentProject.softCap, "Tokensold are less than softcap");


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
            
            // Approval
            require(tokensToAddLiquidity >= 1000, "tokensToAddLiquidity less than 100  0");


            bool approval = IERC20(currentProject.preSaleContractAddr).approve(pancakeSwapRouterAddr, tokensToAddLiquidity);
            require(approval, "cannot send dev's share");

            internalData[_id] = InternalData(
                totalTokensSold,
                revenueFromPresale,
                tokensToAddLiquidity,
                poolShareBNB,
                devTeamShareBNB,
                approval
            );

            (uint amountToken, uint amountETH, uint liquidity) = IPancakeRouter02(pancakeSwapRouterAddr).addLiquidityETH{value : poolShareBNB}(
                    currentProject.preSaleContractAddr,
                    tokensToAddLiquidity,
                    0,
                    0,
                    devTeamAddr,
                    block.timestamp + 5*60
                );

                currentProject.accumulatedBalance = 0;          

            return (amountToken, amountETH, liquidity);
            
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
        require( presaleContract[_id].preSaleContractAddr != address(0), "project does not exist");
        presaleContract[_id].startedAt = _starttime;
        presaleContract[_id].expiredAt = _endTime;
    }
    
    function updateParticipationCriteria (
            uint _id, 
            uint _priceOfEachToken, 
            uint _minTokensForParticipation,
            uint _minContibution, 
            uint _maxContibution, 
            uint _softCap
        ) public onlyOwner {

        require( presaleContract[_id].preSaleContractAddr != address(0), "project does not exist");
        presaleContract[_id].priceOfEachToken = _priceOfEachToken;
        presaleContract[_id].minTokensForParticipation = _minTokensForParticipation;
        presaleContract[_id].minContibution = _minContibution;
        presaleContract[_id].maxContibution = _maxContibution;
        presaleContract[_id].softCap = _softCap;
    }

    function updateReservedTokensPCForLP(uint _id, uint _reservedTokensPCForLP) public onlyOwner {

        require( presaleContract[_id].preSaleContractAddr != address(0), "project does not exist");
        presaleContract[_id].reservedTokensPCForLP = _reservedTokensPCForLP;
    }

    function updateTokensForSale( uint _id, uint _tokensForSale ) public onlyOwner {

        require( presaleContract[_id].preSaleContractAddr != address(0), "project does not exist");
        presaleContract[_id].tokensForSale = _tokensForSale;
        presaleContract[_id].remainingTokensForSale = _tokensForSale;
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
