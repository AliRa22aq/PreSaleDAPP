var Presale = artifacts.require("Presale.sol");
var ERC20 = artifacts.require("ERC20.sol");
var PICNIC = artifacts.require("PICNIC.sol");
// const moment = require('moment');


contract("Presale", (accounts) => {
  
  // let PresaleInstance = await Presale.deployed()
  let PresaleInstance;
  let ERC20Instance;
  let PICNICInstance;
  let PicnicTokenAddr;
  let PresaleTokenAddr;

  
  it("Check if Contract is deploying fine and initial state is as expectation ", async () =>  {
    
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    
    PresaleInstance = await Presale.deployed()
    ERC20Instance = await ERC20.deployed()
    PICNICInstance = await PICNIC.deployed()

    PicnicTokenAddr = PICNICInstance.address;
    PresaleTokenAddr = ERC20Instance.address;
  

    // console.log("PresaleInstance.address address => ", PresaleInstance.address);
    // console.log("ERC20Instance.address address => ", ERC20Instance.address);
    // console.log("PICNICInstance.address address => ", PICNICInstance.address);

    const presale1 = await PresaleInstance.presaleContract(1);
    assert.equal(presale1.preSaleContractAddr, '0x0000000000000000000000000000000000000000', "contract address is null");

    const presale2 = await PresaleInstance.presaleContractStatic(1);
    assert.equal(presale2.preSaleContractAddr, '0x0000000000000000000000000000000000000000', "contract address is null");

    
    const contractbalancePresaleToken = await PresaleInstance.preSaleTokenBalanceOfContract(PresaleTokenAddr)
    const userBalancePresaleToken = await PresaleInstance.preSaleTokenBalanceOfContract(PresaleTokenAddr)
    assert.equal(contractbalancePresaleToken.toString(), '0', "user and contract has no presale tokens");
    assert.equal(userBalancePresaleToken.toString(), '0', "user and contract has no presale tokens");



    const participant1 = await PresaleInstance.participant(1, user1)
    const participant2 = await PresaleInstance.participant(1, user2)
    assert.equal(participant1.tokens.toString(), '0', "participant 1 has no tokens to claim");
    assert.equal(participant1.value.toString(), '0', "participant 1 has no money depositied");
    assert.equal(participant2.tokens.toString(), '0', "participant 2 has no tokens to claim");
    assert.equal(participant2.value.toString(), '0', "participant 2 has no money depositied");


    // user and contract has no presale tokens
    // console.log("participant1 => ", participant1.tokens.toString());
    // console.log("participant1 => ", participant1.value.toString());
    // console.log("participant2 => ", participant2.tokens.toString());
    // console.log("participant2 => ", participant2.value.toString());



  })


  it("Make sure owner can initiate a presale, update it and delete it ", async () =>  {

    const owner = accounts[0];

    PresaleInstance = await Presale.deployed()

    const presale1 = await PresaleInstance.setPresaleContractInfo(
      PresaleTokenAddr, 
      70, 
      1000, 
      1000000000, 
      1000, 
      100, 
      200, 
      500, 
      0, 
      0);

        // // Contract Info
        // address _preSaleContractAddress,
        // uint8 _reservedTokensPCForLP,
        // uint256 _tokensForSale,

        // // Participation Criteria
        // uint256 _priceOfEachToken,
        // uint256 _minTokensForParticipation,
        // uint256 _minTokensReq,
        // uint256 _maxTokensReq,
        // uint256 _softCap,
        // uint256 _startedAt,
        // uint256 _expiredAt


    console.log(presale1);

  })

})