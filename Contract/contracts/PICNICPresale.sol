// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


interface IERC20 {

    function name() external view returns (string memory);
    // function symbol() external view returns (string memory);
    // function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    // function allowance(address owner, address spender) external view returns (uint256);
    // function approve(address spender, uint256 amount) external returns (bool);
    // function transferFrom( address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    // event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract PICNICPresale is Ownable{

    using SafeMath for uint256;
    
    uint count = 0;
    
    address public criteriaToken = 0xd9145CCE52D386f254917e481eB44e9943F39138; 
    
    mapping(uint256 => PresaleContract) public presaleContract;
    
    struct PresaleContract {
        // id
        uint256 presaleId; 
        
        // Contract Info
        address contractAddress;
        string name; 
        uint256 remainingTokens;

        // Participation Criteria
        uint256 priceOfEachToken;
        uint256 minTokensForParticipation;
        uint256 minContibution;        
        uint256 maxContibution;
        uint256 cap;
        uint256 startedAt;
        uint256 expiredAt;

        // Accumulated Balance
        uint256 accumulatedBalance;  
    }
    
    function setPresaleContractInfo(
        // Contract Info
        address _contractAddress,

        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        uint256 _minContibution,        
        uint256 _maxContibution,
        uint256 _cap,
        uint256 _startedAt,
        uint256 _expiredAt
        ) public onlyOwner returns(uint256){

        count++;

        presaleContract[count] = PresaleContract(
            count, //id

            // Contract Info
            _contractAddress,
            IERC20(_contractAddress).name(),
            IERC20(_contractAddress).balanceOf(address(this)),

            // Participation Criteria
            _priceOfEachToken,
            _minTokensForParticipation,
            _minContibution,
            _maxContibution,
            _cap,
            _startedAt,
            _expiredAt,

            0 // accumulatedBalance;
        );
        return count;
    }

    // function getPresaleContractInfo(uint256 _id) public view returns(PresaleContract memory){
    //     return presaleContract[_id];
    // }
    
    function getLatestPresaleContractInfo() public view returns(PresaleContract memory){
        return presaleContract[count];
    }
    
    function updatePresaleContractInfo (
        uint256 _id, // id
        
        // Contract Info
        address _contractAddress,

        // Participation Criteria
        uint256 _priceOfEachToken,
        uint256 _minTokensForParticipation,
        uint256 _minContibution,      
        uint256 _maxContibution,
        uint256 _cap,
        uint256 _startedAt,
        uint256 _expiredAt

        ) public onlyOwner returns(PresaleContract memory){

        // string memory _name = IERC20(presaleContract[_id].contractAddress).name();
        // string memory _symbol = IERC20(presaleContract[_id].contractAddress).symbol();
        // uint256 _remainingTokens = IERC20(presaleContract[_id].contractAddress).balanceOf(address(this));
        // uint256 _accumulatedBalance = presaleContract[_id].accumulatedBalance;
            
        presaleContract[_id]  = PresaleContract(
            _id,
            _contractAddress,
            IERC20(_contractAddress).name(),  // name
            IERC20(_contractAddress).balanceOf(address(this)), //_remainingTokens
            _priceOfEachToken,
            _minTokensForParticipation,
            _minContibution,
            _maxContibution,
            _cap,
            _startedAt,
            _expiredAt,
            presaleContract[_id].accumulatedBalance //_accumulatedBalance

            );
            
        return presaleContract[_id];
    }

    function deletePresaleContractInfo (uint256 _id) public onlyOwner returns(bool){
        delete presaleContract[_id];
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
    
    
    // Helping functions;
    function presaleTokenBalance (uint256 _id, address _address) public view returns(uint256){
        return IERC20(presaleContract[_id].contractAddress).balanceOf(_address);
    }
    
    function PICNICBalanceOfUser() public view returns (uint){
        return IERC20(criteriaToken).balanceOf(address(msg.sender));
    }
    

}
