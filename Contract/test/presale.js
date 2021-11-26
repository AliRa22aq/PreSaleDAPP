var Presale = artifacts.require("Presale.sol");
// const moment = require('moment');


contract("Presale", (accounts) => {
  
  let PresaleInstance;

  it("Check if Contract is deploying fine and initial state is as expectation ", async () =>  {

    const owner = accounts[0];

    PresaleInstance = await Presale.deployed()

    console.log("Contract address => ", PresaleInstance.address);

  })


  it("Make sure owner can initiate a presale, update it and delete it ", async () =>  {

    const owner = accounts[0];

    PresaleInstance = await Presale.deployed()
    
    await PresaleInstance.setPresaleContractInfo(
      '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10',
      70, 
      1000,
      1000000000,
      1000,
      100,
      500,
      500,
      0,
      0
    );

    console.log(owner);

  })

})