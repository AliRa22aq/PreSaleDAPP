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
    uint upfrontfee = 0;
    uint8 presaleFeeShare = 0;
    
    // address public criteriaTokenAddr = 0x067F4A06A1CF8d3f508f4288d6cE7f5d90653AEb;
    address public TeamAddr = 0xE813d775f33a97BDA25D71240525C724423D4Cd0;
    address public devAddr = 0xE813d775f33a97BDA25D71240525C724423D4Cd0;
    
    //# PancakeSwap on BSC mainnet
    // address pancakeSwapFactoryAddr = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    // address pancakeSwapRouterAddr = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    // address WBNBAddr = 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c;
    // 0x0000000000000000000000000000000000000000
    
      
    //# PancakeSwap on BSC testnet:
    address pancakeSwapFactoryAddr = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;
    address pancakeSwapRouterAddr = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;
    address WBNBAddr = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
    
    mapping(uint256 => PresaleInfo) public presaleInfo;
    mapping(uint256 => PresalectCounts) public presalectCounts;
    mapping(uint256 => PresaleParticipationCriteria) public presaleParticipationCriteria;

    mapping(uint256 => InternalData) public internalData;
    mapping(address => bool) public isOwnerWhitelisted;
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
        bool approval;
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
        uint256 participants;
        uint256 countOfClaims;
    }
    
    struct PresaleInfo {
        // Contract Info
        PresaleType typeOfPresale;
        address preSaleContractAddr;
        address ownerOfPresale;
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
        // uint256 minTokensReq;
        // uint256 maxTokensReq;
        uint256 softCap;
        PresaleTimes presaleTimes;
        // uint256 startedAt;
        // uint256 expiredAt;
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
        require(presaleInfo[_id].ownerOfPresale == _msgSender(), "Ownable: caller is not the owner of this presale");
        _;
    }

    function updateUpfrontFee(uint _fee) public onlyOwner {
        upfrontfee = _fee;
    }

    function whiteListUsersToStartProject(address _address) public onlyOwner {
        isOwnerWhitelisted[_address] = true;
    }

    function whiteListUsersToStartProject(uint _id, address _address) public onlyOwner {
        participant[_id][_address].whiteListed = true;
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

        if(msg.sender != owner() || isOwnerWhitelisted[msg.sender]){
            require( msg.value >= upfrontfee, "Insufficient Funds to start the presale");
        }
        
        if(_presaleType == PresaleType.open || _presaleType == PresaleType.onlyWhiteListed){
            require( _criteriaTokenAddr == address(0), "Criteria token address should be a null address");
        }
        else if(_presaleType == PresaleType.onlyTokenHolders){
            require( _criteriaTokenAddr != address(0), "Criteria token address shouldn't be a null address");
        }


        require( _preSaleContractAddress != address(0), "Presale project address can't be null");
        require( _tokensForSale > 0, "tokens for sale must be more than 0");
        require( _softCap < _tokensForSale, "softcap should be less than the tokan tokens on sale");
        require( _reqestedTokens.maxTokensReq > _reqestedTokens.minTokensReq, "_maxTokensReq > _minTokensReq");
        require( _presaleTimes.startedAt > block.timestamp && _presaleTimes.expiredAt > block.timestamp, "_maxTokensReq > _minTokensReq");

        uint reservedTokens = _tokensForSale.mul(_reservedTokensPCForLP).div(100);
        // IERC20(_preSaleContractAddress).transfer( address(this), _tokensForSale.add(reservedTokens) );
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
            // address(0),
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

        return count;
    }


    // function deletePresaleContractInfo (uint256 _id) public onlyOwner isIDValid(_id){
    //     delete presaleContract[_id];
    //     delete presaleContractStatic[_id];
    // }


    function buyTokensOnPresale(uint256 _id, uint256 _numOfTokensRequested) payable public isIDValid(_id) isPresaleActive(_id){

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
        
        presalectCounts[_id].participants++;
        presaleInfo[_id].accumulatedBalance = info.accumulatedBalance.add(msg.value);
        presaleInfo[_id].remainingTokensForSale = info.remainingTokensForSale.sub(_numOfTokensRequested);

        uint newValue = currentParticipant.value.add(msg.value);
        uint newTokens = currentParticipant.tokens.add(_numOfTokensRequested);

        participant[_id][msg.sender] = Partipant(newValue, newTokens, currentParticipant.whiteListed);
        
    }

    // function claimTokensOrARefund(uint _id) public isIDValid(_id){
        
    //     PreSaleStatus _status = presaleContractStatic[_id].preSaleStatus;
    //     uint totalBalance = preSaleTokenBalanceOfContract(_id);
    //     require(_status == PreSaleStatus.succeed || _status == PreSaleStatus.failed, "Presale is not concluded yet");        
        
    //     Partipant memory _participant = participant[_id][msg.sender];
        
    //     if (_status == PreSaleStatus.succeed){
    //         require(_participant.tokens > 0, "No tokens to claim");        
    //         require(_participant.tokens <= totalBalance, "No tokens to claim");        
    //         bool tokenDistribution = IERC20(presaleContract[_id].preSaleContractAddr).transfer(msg.sender, _participant.tokens);
    //         require(tokenDistribution, "Unable to transfer tokens to the participant");
    //         participant[_id][msg.sender] = Partipant(0, 0);
    //         presaleContractStatic[_id].countOfClaims++;
    //     }
    //     else if(_status == PreSaleStatus.failed){
    //         require(_participant.value > 0, "No amount to refund");        
    //         bool refund = payable(msg.sender).send(_participant.value);
    //         require(refund, "Unable to refund amount to the participant");
    //         participant[_id][msg.sender] = Partipant(0, 0);
    //         presaleContractStatic[_id].countOfClaims++;

    //     }

    // }
    

    // function endPresale(uint _id) public onlyPresaleOwner(_id) isIDValid(_id) returns (uint, uint, uint){
        
    //     PresaleContract memory currentProject = presaleContract[_id];
        
    //     require(block.timestamp > currentProject.expiredAt, "Presale is not over yet");
        
    //     uint256 totalTokensSold = currentProject.tokensForSale.sub(currentProject.remainingTokensForSale);
        
    //     if( totalTokensSold >= currentProject.softCap ){
                        
    //         uint256 revenueFromPresale = currentProject.accumulatedBalance;
    //         require(revenueFromPresale > 0, "No revenue to add liquidity");
            
    //         uint256 tokensToAddLiquidity = totalTokensSold.mul(currentProject.reservedTokensPCForLP).div(100);
    //         uint256 poolShareBNB = revenueFromPresale.mul(currentProject.reservedTokensPCForLP).div(100);
    //         uint256 devTeamShareBNB = revenueFromPresale.sub(poolShareBNB);
            
    //         if(tokensToAddLiquidity >= 1000){
    //             // successful presale

    //             // Approval
    //             bool approval = IERC20(currentProject.preSaleContractAddr).approve(pancakeSwapRouterAddr, tokensToAddLiquidity);
    //             require(approval, "unable to approve token tranfer to pancakeSwapRouterAddr");

    //             (bool devTeam) = payable(devTeamAddr).send(devTeamShareBNB);
    //             require(devTeam, "cannot send dev's share");

    //             internalData[_id] = InternalData(
    //                 totalTokensSold,
    //                 revenueFromPresale,
    //                 tokensToAddLiquidity,
    //                 poolShareBNB,
    //                 devTeamShareBNB,
    //                 approval
    //             );

    //             presaleContractStatic[_id].preSaleStatus = PreSaleStatus.succeed;
    //             presaleContract[_id].accumulatedBalance = 0;

    //             (uint amountToken, uint amountETH, uint liquidity) = IPancakeRouter02(pancakeSwapRouterAddr).addLiquidityETH{value : poolShareBNB}(
    //                     currentProject.preSaleContractAddr,
    //                     tokensToAddLiquidity,
    //                     0,
    //                     0,
    //                     devTeamAddr,
    //                     block.timestamp + 5*60
    //                 );


    //             return (amountToken, amountETH, liquidity);

    //         } 
    //         else {
    //             // Failed Presale
    //             presaleContractStatic[_id].preSaleStatus = PreSaleStatus.failed;
    //             return (0,0,0);

    //         }
            
    //     }
    //     else {
    //         presaleContractStatic[_id].preSaleStatus = PreSaleStatus.failed;
    //         return (0,0,0);
    //     }
        
    // }

    // function BNBbalanceOfContract() public view returns(uint){
    //     return address(this).balance;  
    // }

    // function updatePresaleTime(uint _id, uint _starttime, uint _endTime) public onlyPresaleOwner(_id) isIDValid(_id){
    //     presaleContract[_id].startedAt = _starttime;
    //     presaleContract[_id].expiredAt = _endTime;
    // }

   
    // function updateParticipationCriteria (
    //         uint _id, 
    //         uint _priceOfEachToken, 
    //         uint _minTokensForParticipation,
    //         uint _minTokensReq, 
    //         uint _maxTokensReq, 
    //         uint _softCap
    //     ) public onlyPresaleOwner(_id) isIDValid(_id) {

    //     // require( block.timestamp < presaleContract[_id].expiredAt, "project is expired");
    //     presaleContract[_id].priceOfEachToken = _priceOfEachToken;
    //     presaleContract[_id].minTokensForParticipation = _minTokensForParticipation;
    //     presaleContract[_id].minTokensReq = _minTokensReq;
    //     presaleContract[_id].maxTokensReq = _maxTokensReq;
    //     presaleContract[_id].softCap = _softCap;
    // }


    // function updateTokensForSale( uint _id, uint _tokensForSale, uint _reservedTokensPCForLP ) public onlyPresaleOwner(_id) isIDValid(_id) {
    //     presaleContract[_id].tokensForSale = _tokensForSale;
    //     presaleContract[_id].remainingTokensForSale = _tokensForSale;
    //     presaleContract[_id].reservedTokensPCForLP = _reservedTokensPCForLP;
    // }

    // function setCriteriaToken(address _criteriaToken) public onlyPresaleOwner(_id) {
    //     criteriaTokenAddr = _criteriaToken;
    // }
    
    // function setDevTeamAddr(address _devTeamAddr) public onlyOwner {
    //     devTeamAddr = _devTeamAddr;
    // }


    // function burnOrWithdrawRemainingTokens(uint _id, Withdrawtype _withdrawtype ) public onlyPresaleOwner(_id) isIDValid(_id){
    //     IERC20 _token = IERC20(presaleContract[_id].preSaleContractAddr);
    //     uint totalTokens = _token.balanceOf(address(this));
    //     require( totalTokens > 0, "Contract has no presale tokens");

    //     if(_withdrawtype == Withdrawtype.withdraw ){
    //         bool tokenDistribution = _token.transfer(msg.sender, totalTokens);
    //         require( tokenDistribution, "unable to send tokens to the owner");
    //     }
    //     else{
    //         bool tokenDistribution = _token.transfer(0x000000000000000000000000000000000000dEaD , totalTokens);
    //         require( tokenDistribution, "unable to send tokens to the owner");
    //     }
    //     presaleContract[_id].tokensForSale = 0;
    //     presaleContract[_id].remainingTokensForSale = 0;
    //     presaleContractStatic[_id].preSaleStatus = PreSaleStatus.closed;
    // }

    // function pausePresale(uint _id) public onlyPresaleOwner(_id) isIDValid(_id) {
    //     presaleContractStatic[_id].preSaleStatus = PreSaleStatus.paused;
    // }
    
    // function unpausePresale(uint _id) public onlyPresaleOwner(_id) isIDValid(_id) {
    //     presaleContractStatic[_id].preSaleStatus = PreSaleStatus.inProgress;
    // }

    // // Helping functions;
    // function preSaleTokenBalanceOfContract (uint _id) public view returns(uint256){
    //     return IERC20(presaleContract[_id].preSaleContractAddr).balanceOf(address(this));
    // }
    
    // function preSaleTokenBalanceOfUser (uint _id) public view returns(uint256){
    //     return IERC20(presaleContract[_id].preSaleContractAddr).balanceOf(address(msg.sender));
    // }

    // function criteriaTokenBalanceOfUser() public view returns (uint){
    //     return IERC20(criteriaTokenAddr).balanceOf(address(msg.sender));
    // }

}