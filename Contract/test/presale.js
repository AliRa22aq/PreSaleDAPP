var Presale = artifacts.require("Presale.sol");
// const moment = require('moment');


contract("Presale", (accounts) => {
  
  let PresaleInstance;

  it("Check if Contract is deploying fine and initial state is as expectation ", async () =>  {

    const owner = accounts[0];

    PresaleInstance = await Presale.deployed()

  })

})