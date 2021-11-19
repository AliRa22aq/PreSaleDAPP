//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

interface IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom( address sender, address recipient, uint256 amount) external returns (bool);
}

    interface IFactory {
    //   function getPair(address tokenA, address tokenB) external view returns (address pair);
      function createPair(address tokenA, address tokenB) external returns (address pair);
    }

interface IRouter {
    function factory() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
}

contract PICNICPresale is Ownable {

    using SafeMath for uint256;
    
    uint count = 0;
    
    address public criteriaToken = 0xd9145CCE52D386f254917e481eB44e9943F39138; 
    
    //# Ethereum mainnet, and the Ropsten, Rinkeby, Görli, and Kovan testnets
    address UniswapV2Factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address UniswapV2Router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    
    
    //# PancakeSwap on BSC testnet:
    address pancakeSwapFactory = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;
    address pancakeSwapRouter = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;

    //# BNB address
    address BNB = 0xB8c77482e45F1F44dE1745F52C74426C631bDD52;
    
    enum PoolType{ UNI, PCS }

    
    mapping(uint256 => PresaleContract) public presaleContract;
    mapping(uint256 => PresaleContractStaticInfo) public presaleContractStatic;

    
    struct PresaleContractStaticInfo {
        address contractAddress;
        string symbol;
        string name;
        PoolType _poolType;
        address pairAddress;
    }
    
    struct PresaleContract {
        // id
        uint256 presaleId;
        
        // Contract Info
        address contractAddress;
        uint256 remainingTokens;
        uint256 accumulatedBalance;

        uint256 totalTokensOnSale;
        uint256 softCap;
        uint256 hardCap;
        
        // Participation Criteria
        uint256 priceOfEachToken;
        uint256 minTokensForParticipation;
        uint256 minContibution;        
        uint256 maxContibution;
        uint256 startedAt;
        uint256 expiredAt;
        
        // PresaleContractStaticInfo staticInfo;
    }
    
    function setPresaleContractInfo(
        // Contract Info
        address _contractAddress,

        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        uint256 _minContibution,        
        uint256 _maxContibution,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _startedAt,
        uint256 _expiredAt,
        PoolType _poolType
        
        ) public onlyOwner returns(uint){

        count++;
        
        address _pairAddr = _poolType == PoolType.UNI ?
            IFactory(UniswapV2Factory).createPair(_contractAddress, BNB):
            IFactory(pancakeSwapFactory).createPair(_contractAddress, BNB);

        uint presaleTokensInContract = IERC20(_contractAddress).balanceOf(address(this));
        
        
        presaleContractStatic[count] = PresaleContractStaticInfo(
            _contractAddress,
            IERC20(_contractAddress).symbol(),
            IERC20(_contractAddress).name(),
            _poolType,
            _pairAddr
        );



        presaleContract[count] = PresaleContract(
            count, //id

            // Contract Info
            _contractAddress,
            presaleTokensInContract,
            0, // accumulatedBalance;
            
            presaleTokensInContract,
            _softCap,
            _hardCap,

            // Participation Criteria
            _priceOfEachToken,
            _minTokensForParticipation,
            _minContibution,
            _maxContibution,
            _startedAt,
            _expiredAt
        );
        
        return count;
    }

    
    function getLatestPresaleContractStaticInfo() public view returns(PresaleContractStaticInfo memory){
        return presaleContractStatic[count];
    }
    
    function getLatestPresaleContractInfo() public view returns(PresaleContract memory){
        return presaleContract[count];
    }
    
    function updatePresaleContractInfo (
        uint256 _id, // id
        
        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        uint256 _minContibution,      
        uint256 _maxContibution,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _startedAt,
        uint256 _expiredAt

        ) public onlyOwner returns(PresaleContract memory){

        PresaleContract memory currentProject = presaleContract[_id];
        uint presaleTokensInContract = IERC20(presaleContract[_id].contractAddress).balanceOf(address(this));

        presaleContract[_id]  = PresaleContract(
            _id,
            
            currentProject.contractAddress,
            presaleTokensInContract, //_remainingTokens
            currentProject.accumulatedBalance, //_accumulatedBalance;
            
            presaleTokensInContract, //_remainingTokens
            _softCap,
            _hardCap,
            
            _priceOfEachToken,
            _minTokensForParticipation,
            _minContibution,
            _maxContibution,
            _startedAt,
            _expiredAt

        );
            
        return presaleContract[_id];
    }

    function deletePresaleContractInfo (uint256 _id) public onlyOwner returns(bool){
        delete presaleContract[_id];
        delete presaleContractStatic[_id];

        return true;
    }


    function buyTokensOnPresale(uint256 _id, uint256 _numOfTokensRequested) payable public returns (bool){
        
        require(block.timestamp > presaleContract[_id].startedAt, "Presale hasn't begin yet. please wait");
        require(block.timestamp < presaleContract[_id].expiredAt, "Presale is over. Try next time");
        require(_numOfTokensRequested <= presaleContract[_id].remainingTokens, "insufficient tokens to fulfill this order");
        require(msg.value >= _numOfTokensRequested*presaleContract[_id].priceOfEachToken, "insufficient funds");

        uint256 PICNICTokensOfUser = IERC20(criteriaToken).balanceOf(msg.sender);
        require(PICNICTokensOfUser >= presaleContract[_id].minTokensForParticipation, "Not enough tokens to participate. Should be atleast 250");
        
    
        require(_numOfTokensRequested >= presaleContract[_id].minContibution, "Contribution is low, Please request more than minimum contribution");
        require(_numOfTokensRequested + IERC20(presaleContract[_id].contractAddress).balanceOf(address(msg.sender)) <= presaleContract[_id].maxContibution, "Contribution is high, Please request less than maximum contribution");

        
        bool tokenDistribution = IERC20(presaleContract[_id].contractAddress).transfer(address(msg.sender), _numOfTokensRequested);
        
        if(tokenDistribution == true){
            presaleContract[_id].accumulatedBalance += msg.value; 
            presaleContract[_id].remainingTokens -= _numOfTokensRequested; 

        }
        
        return tokenDistribution;

    }
    
        function endPresale(uint _id) public onlyOwner {
            
            uint revenueFromPresale = PresaleContract[_id].accumulatedBalance;
            
            uint devTeamShare = revenueFromPresale.mul(30).div(100);
            
            uint poolShare = revenueFromPresale.sub(devTeamShare);
            
            PresaleContract[_id].accumulatedBalance = 0;
            
            // Split revue
            
            // Send dev team their contribution
            
            // find remaining balanceOf
            
            // Provide liquidity to the pool and send LP tokens to dev team
            
    // uint _type =  PresaleContract[_id]._poolType;
    // PoolType{ UNI, PCS }

    
    // mapping(uint256 => PresaleContract) public presaleContract;
    // mapping(uint256 => PresaleContractStaticInfo) public presaleContractStatic;
            
            
        }
        
        function factory(PoolType _poolType) public view returns (address){
            address  _factoryAddr;
            
            _factoryAddr = _poolType == PoolType.UNI ?
             IRouter(UniswapV2Router02).factory():
             IRouter(pancakeSwapFactory).factory();
             
             return _factoryAddr;
          }

        // Helping functions;
        function presaleTokenBalance (uint256 _id, address _address) public view returns(uint256){
            return IERC20(presaleContract[_id].contractAddress).balanceOf(_address);
        }
        
        function PICNICBalanceOfUser() public view returns (uint){
            return IERC20(criteriaToken).balanceOf(address(msg.sender));
        }
    

}
