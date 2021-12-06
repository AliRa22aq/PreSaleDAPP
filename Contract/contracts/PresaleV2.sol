//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./IERC20.sol";
import "./IPancakeRouter02.sol";
import "./IPancakeFactory.sol";

contract Presale is Ownable{

    using SafeMath for uint256;
    
    uint public count = 0;
    uint public upfrontfee = 1;
    uint8 public salesFeeInPercent = 1;
    
    address public teamAddr = 0xE813d775f33a97BDA25D71240525C724423D4Cd0;
    address public devAddr = 0xE813d775f33a97BDA25D71240525C724423D4Cd0;
    
    //# PancakeSwap on BSC mainnet
    // address pancakeSwapFactoryAddr = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    // address pancakeSwapRouterAddr = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    // address WBNBAddr = 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c;
  
      
    //# PancakeSwap on BSC testnet:
    address pancakeSwapFactoryAddr = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;
    address pancakeSwapRouterAddr = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;
    address WBNBAddr = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
    
    mapping(uint256 => PresaleInfo) public presaleInfo;
    mapping(uint256 => PresalectCounts) public presalectCounts;
    mapping(uint256 => PresaleParticipationCriteria) public presaleParticipationCriteria;
    mapping(uint256 => uint8) public salesFeeInPercentForAProject;

    mapping(uint256 => InternalData) public internalData;
    mapping(address => bool) public isUserWhitelistedToStartProject;
    mapping(uint256 => mapping(address => Partipant)) public participant;

    enum PresaleType {open, onlyWhiteListed, onlyTokenHolders}
    enum PreSaleStatus {paused, inProgress, succeed, failed, closed}
    enum Withdrawtype {burn, withdraw}

    struct InternalData {
        uint totalTokensSold;
        uint revenueFromPresale;
        uint tokensToAddLiquidity;
        uint poolShareBNB;
        uint devTeamShareBNB;
        uint ownersShareBNB;
    }

    struct Partipant {
        uint256 value;
        uint256 tokens;
        bool whiteListed;
    }
    
    struct PresaleTimes{
        uint256 startedAt;
        uint256 expiredAt;
    }

    struct ReqestedTokens{
        uint256 minTokensReq;
        uint256 maxTokensReq;
    }

    struct PresalectCounts {
        uint256 participantsCount;
        uint256 claimsCount;
    }
    
    struct PresaleInfo {
        // Contract Info
        PresaleType typeOfPresale;
        address preSaleContractAddr;
        address presaleOwnerAddr;
        string symbol;
        string name;
        
        // Token distribution
        uint256 priceOfEachToken;
        uint256 tokensForSale;              // 1000
        uint256 reservedTokensPCForLP;      // 70% = 0.7   =>   1700/1.7 = 700
        uint256 remainingTokensForSale;
        uint256 accumulatedBalance;
        address pairAddress;
        PreSaleStatus preSaleStatus;
    }

    struct PresaleParticipationCriteria {
        // Contract Info
        address preSaleContractAddr;
        
        // Participation Criteria
        address criteriaTokenAddr;
        uint256 minTokensForParticipation;
        ReqestedTokens reqestedTokens;
        uint256 softCap;
        PresaleTimes presaleTimes;  
    }    

    modifier isIDValid(uint _id) {
        require (presaleInfo[_id].preSaleContractAddr != address(0), "Not a valid ID");
        _;
    }

    modifier isPresaleActive(uint _id) {
        require( block.timestamp < presaleParticipationCriteria[_id].presaleTimes.expiredAt, "Presale is over. Try next time");
        require (block.timestamp >= presaleParticipationCriteria[_id].presaleTimes.startedAt, "Presale hasn't begin yet. please wait");
        require(presaleInfo[_id].preSaleStatus == PreSaleStatus.inProgress, "Presale is not in progress");
        _;
    }

    modifier onlyPresaleOwner(uint _id) {
        require(presaleInfo[_id].presaleOwnerAddr == _msgSender(), "Ownable: caller is not the owner of this presale");
        _;
    }


    function whiteListUsersToStartProject(address _address) public onlyOwner {
        isUserWhitelistedToStartProject[_address] = true;
    }

    function whiteListUsersToBuyTokens(uint _id, address _address) public onlyPresaleOwner(_id) {
        participant[_id][_address].whiteListed = true;
    }

    function updateFees(uint8 _upfrontFee, uint8 _salesFeeInPercent) public onlyOwner {
        upfrontfee = _upfrontFee;
        salesFeeInPercent = _salesFeeInPercent;
    }

    function updateSalesFeeInPercentForAProject(uint _id, uint8 _fee) public onlyOwner {
        salesFeeInPercentForAProject[_id] = _fee;
    }

    function setPresale(
        // Contract Info
        PresaleType _presaleType,
        address _preSaleContractAddress,
        address _criteriaTokenAddr,
        uint8 _reservedTokensPCForLP,
        uint256 _tokensForSale,

        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        PresaleTimes memory _presaleTimes,
        ReqestedTokens memory _reqestedTokens,
        uint256 _softCap

        ) payable public returns(uint){

        if( msg.sender != owner() ){
            if(!isUserWhitelistedToStartProject[msg.sender]){
                require( msg.value >= upfrontfee, "Insufficient Funds to start the presale");
            }
        }
        
        if(_presaleType == PresaleType.onlyTokenHolders){
            require( _criteriaTokenAddr != address(0), "Criteria token address shouldn't be a null address");
        }

        require( _preSaleContractAddress != address(0), "Presale project address can't be null");
        require( _tokensForSale > 0, "tokens for sale must be more than 0");
        require( _softCap < _tokensForSale, "softcap should be less than the tokan tokens on sale");
        require( _reqestedTokens.maxTokensReq > _reqestedTokens.minTokensReq, "_maxTokensReq > _minTokensReq");
        // require( _presaleTimes.startedAt > block.timestamp && _presaleTimes.expiredAt > block.timestamp, "_maxTokensReq > _minTokensReq");

        uint reservedTokens = _tokensForSale.mul(_reservedTokensPCForLP).div(100);
        bool transfer = IERC20(_preSaleContractAddress).transferFrom(msg.sender, address(this), _tokensForSale.add(reservedTokens));
        require( transfer, "Unable to transfer presale tokens to the contract");

        count++;
        
        address _address = IPancakeFactory(pancakeSwapFactoryAddr).createPair(_preSaleContractAddress, WBNBAddr);


        presaleInfo[count] = PresaleInfo(
            _presaleType,
            _preSaleContractAddress,
            msg.sender,
            IERC20(_preSaleContractAddress).symbol(),
            IERC20(_preSaleContractAddress).name(),

            _priceOfEachToken,
            _tokensForSale,                     // 1000    tokensForSale
            _reservedTokensPCForLP,
            _tokensForSale,                     // remainingTokensForSale = tokensForSale (initially)
            0,
            _address,
            PreSaleStatus.inProgress
        );


        presaleParticipationCriteria[count] = PresaleParticipationCriteria(
            _preSaleContractAddress,
            _criteriaTokenAddr,
            _minTokensForParticipation,
            _reqestedTokens,
            _softCap,
            _presaleTimes
        );

        presalectCounts[count] = PresalectCounts (
            0,
            0
        );

        salesFeeInPercentForAProject[count] = salesFeeInPercent;

        return count;
    }


    // function deletePresaleContractInfo (uint256 _id) public onlyOwner isIDValid(_id){
    //     delete presaleContract[_id];
    //     delete presaleContractStatic[_id];
    // }


                                                                                    // isPresaleActive(_id)
    function buyTokensOnPresale(uint256 _id, uint256 _numOfTokensRequested) payable public isIDValid(_id) {

        PresaleInfo memory info = presaleInfo[_id];
        PresaleParticipationCriteria memory criteria = presaleParticipationCriteria[_id];

        Partipant memory currentParticipant = participant[_id][msg.sender];

        if(info.typeOfPresale == PresaleType.onlyWhiteListed){
            require( currentParticipant.whiteListed == true, "Only whitelisted users are allowed to participate");
        }
        else if(info.typeOfPresale == PresaleType.onlyTokenHolders){
            require(IERC20(criteria.criteriaTokenAddr).balanceOf(msg.sender) >= criteria.minTokensForParticipation, "You don't hold enough criteria tokens");
        }

        require(_numOfTokensRequested <= info.remainingTokensForSale, "insufficient tokens to fulfill this order");
        require(msg.value >= _numOfTokensRequested*info.priceOfEachToken, "insufficient funds");
        
        if(currentParticipant.tokens == 0){
            require(_numOfTokensRequested >= criteria.reqestedTokens.minTokensReq, "Request for tokens is low, Please request more than minTokensReq");
        }
        require(_numOfTokensRequested + currentParticipant.tokens <= criteria.reqestedTokens.maxTokensReq, "Request for tokens is high, Please request less than maxTokensReq");
        
        presalectCounts[_id].participantsCount++;
        presaleInfo[_id].accumulatedBalance = info.accumulatedBalance.add(msg.value);
        presaleInfo[_id].remainingTokensForSale = info.remainingTokensForSale.sub(_numOfTokensRequested);

        uint newValue = currentParticipant.value.add(msg.value);
        uint newTokens = currentParticipant.tokens.add(_numOfTokensRequested);

        participant[_id][msg.sender] = Partipant(newValue, newTokens, currentParticipant.whiteListed);
        
    }

    function claimTokensOrARefund(uint _id) public isIDValid(_id) {
        
        Partipant memory _participant = participant[_id][msg.sender];

        PreSaleStatus _status = presaleInfo[_id].preSaleStatus;
        uint totalBalance = preSaleTokenBalanceOfContract(_id);
        require(_status == PreSaleStatus.succeed || _status == PreSaleStatus.failed, "Presale is not concluded yet");
        
        
        if (_status == PreSaleStatus.succeed){
            require(_participant.tokens > 0, "No tokens to claim");
            require(_participant.tokens <= totalBalance, "Not enough tokens are available");
            bool tokenDistribution = IERC20(presaleParticipationCriteria[_id].preSaleContractAddr).transfer(msg.sender, _participant.tokens);
            require(tokenDistribution, "Unable to transfer tokens to the participant");
            participant[_id][msg.sender] = Partipant(0, 0, _participant.whiteListed);
            presalectCounts[_id].claimsCount++;
        }
        else if(_status == PreSaleStatus.failed){
            require(_participant.value > 0, "No amount to refund");
            bool refund = payable(msg.sender).send(_participant.value);
            require(refund, "Unable to refund amount to the participant");
            participant[_id][msg.sender] = Partipant(0, 0, _participant.whiteListed);
            presalectCounts[_id].claimsCount++;

        }

    }
    

    function endPresale(uint _id) public onlyPresaleOwner(_id) isIDValid(_id) returns (uint, uint, uint){
        
        PresaleInfo memory info = presaleInfo[_id];
        
        // require(block.timestamp > criteria.presaleTimes.expiredAt, "Presale is not over yet");
        
        uint256 totalTokensSold = info.tokensForSale.sub(info.remainingTokensForSale);
        
        if( totalTokensSold >= presaleParticipationCriteria[_id].softCap ){
            
            uint256 tokensToAddLiquidity = totalTokensSold.mul(info.reservedTokensPCForLP).div(100);
            
            if(tokensToAddLiquidity >= 1000){

                internalData[_id].totalTokensSold = totalTokensSold;
                internalData[_id].tokensToAddLiquidity = tokensToAddLiquidity;

                uint256 poolShareBNB = distributeRevenue(_id);

                // Approval
                // bool approval = IERC20(info.preSaleContractAddr).approve(pancakeSwapRouterAddr, tokensToAddLiquidity);
                require(IERC20(info.preSaleContractAddr).approve(pancakeSwapRouterAddr, tokensToAddLiquidity), "unable to approve token tranfer to pancakeSwapRouterAddr");

                (uint amountToken, uint amountETH, uint liquidity) = IPancakeRouter02(pancakeSwapRouterAddr).addLiquidityETH{value : poolShareBNB}(
                    info.preSaleContractAddr,
                    tokensToAddLiquidity,
                    0,
                    0,
                    info.presaleOwnerAddr,
                    block.timestamp + 5*60
                );

                // successful presale
                presaleInfo[_id].preSaleStatus = PreSaleStatus.succeed;
                presaleInfo[_id].accumulatedBalance = 0;

                return (amountToken, amountETH, liquidity);

            } 
            else {
                // Failed Presale
                presaleInfo[_id].preSaleStatus = PreSaleStatus.failed;
                return (0,0,0);

            }
            
        }
        else {
            presaleInfo[_id].preSaleStatus = PreSaleStatus.failed;
            return (0,0,0);
        }
        
    }


    function distributeRevenue(uint _id) internal returns  (uint256) {

        PresaleInfo memory info = presaleInfo[_id];

        uint256 revenueFromPresale = info.accumulatedBalance;
        require(revenueFromPresale > 0, "No revenue to add liquidity");

        uint256 devTeamShareBNB = revenueFromPresale.mul(salesFeeInPercentForAProject[_id]).div(100);
        uint256 poolShareBNB = revenueFromPresale.mul(info.reservedTokensPCForLP).div(100);
        uint256 ownersShareBNB = revenueFromPresale.sub(poolShareBNB.add(devTeamShareBNB));

        require(payable(info.presaleOwnerAddr).send(ownersShareBNB), "cannot send owner's share");

        uint devShare = devTeamShareBNB.mul(75).div(100);
        require(payable(devAddr).send(devShare), "cannot send owner's share"); 

        uint teamShare = devTeamShareBNB.sub(devShare);
        require(payable(teamAddr).send(teamShare), "cannot send owner's share");
        
        internalData[_id].revenueFromPresale = revenueFromPresale;
        internalData[_id].poolShareBNB = poolShareBNB;
        internalData[_id].devTeamShareBNB = devTeamShareBNB;
        internalData[_id].ownersShareBNB = ownersShareBNB;

        return  poolShareBNB;

    }

    // function approveTokensToContract(address _tokenAddr, uint _amount) public {
    //     bool approval = IERC20(_tokenAddr).approve(address(this) , _amount);
    //     require(approval, "unable to approve tokens to the contract. Make sure you have this amount");
    // }

    function BNBbalanceOfContract() public view returns(uint){
        return address(this).balance;
    }

    function updatePresaleTime(uint _id, uint _starttime, uint _endTime) public onlyPresaleOwner(_id) isIDValid(_id){
        presaleParticipationCriteria[_id].presaleTimes.startedAt = _starttime;
        presaleParticipationCriteria[_id].presaleTimes.expiredAt = _endTime;
    }

   
    function updateParticipationCriteria (
            uint _id, 
            uint _priceOfEachToken, 
            uint _minTokensForParticipation,
            uint _minTokensReq, 
            uint _maxTokensReq, 
            uint _softCap
        ) public onlyPresaleOwner(_id) isIDValid(_id) {

        // require( block.timestamp < presaleContract[_id].expiredAt, "project is expired");
        presaleInfo[_id].priceOfEachToken = _priceOfEachToken;
        presaleParticipationCriteria[_id].minTokensForParticipation = _minTokensForParticipation;
        presaleParticipationCriteria[_id].reqestedTokens.minTokensReq = _minTokensReq;
        presaleParticipationCriteria[_id].reqestedTokens.maxTokensReq = _maxTokensReq;
        presaleParticipationCriteria[_id].softCap = _softCap;
    }


    // function updateTokensForSale( uint _id, uint _tokensForSale, uint _reservedTokensPCForLP ) public onlyPresaleOwner(_id) isIDValid(_id) {
    //     presaleContract[_id].tokensForSale = _tokensForSale;
    //     presaleContract[_id].remainingTokensForSale = _tokensForSale;
    //     presaleContract[_id].reservedTokensPCForLP = _reservedTokensPCForLP;
    // }

    function setCriteriaToken(uint _id, address _criteriaToken) public onlyPresaleOwner(_id) {
        presaleParticipationCriteria[_id].criteriaTokenAddr = _criteriaToken;
    }
    
    function updateteamAddr(address _teamAddr) public onlyOwner {
        teamAddr = _teamAddr;
    }


    function burnOrWithdrawRemainingTokens(uint _id, Withdrawtype _withdrawtype ) public onlyPresaleOwner(_id) isIDValid(_id){
        IERC20 _token = IERC20(presaleInfo[_id].preSaleContractAddr);
        uint totalTokens = _token.balanceOf(address(this));
        require( totalTokens > 0, "Contract has no presale tokens");

        if(_withdrawtype == Withdrawtype.withdraw ){
            bool tokenDistribution = _token.transfer(msg.sender, totalTokens);
            require( tokenDistribution, "unable to send tokens to the owner");
        }
        else{
            bool tokenDistribution = _token.transfer(0x000000000000000000000000000000000000dEaD , totalTokens);
            require( tokenDistribution, "unable to send tokens to the owner");
        }
        presaleInfo[_id].tokensForSale = 0;
        presaleInfo[_id].remainingTokensForSale = 0;
        presaleInfo[_id].preSaleStatus = PreSaleStatus.closed;
    }

    function pausePresale(uint _id) public onlyPresaleOwner(_id) isIDValid(_id) {
        presaleInfo[_id].preSaleStatus = PreSaleStatus.paused;
    }
    
    function unpausePresale(uint _id) public onlyPresaleOwner(_id) isIDValid(_id) {
        presaleInfo[_id].preSaleStatus = PreSaleStatus.inProgress;
    }

    // // Helping functions;
    function preSaleTokenBalanceOfContract (uint _id) public view returns(uint256){
        return IERC20(presaleParticipationCriteria[_id].preSaleContractAddr).balanceOf(address(this));
    }
    
    function preSaleTokenBalanceOfUser (uint _id) public view returns(uint256){
        return IERC20(presaleInfo[_id].preSaleContractAddr).balanceOf(address(msg.sender));
    }

    function criteriaTokenBalanceOfUser(uint _id) public view returns (uint){
        return IERC20(presaleParticipationCriteria[_id].criteriaTokenAddr).balanceOf(address(msg.sender));
    }

}