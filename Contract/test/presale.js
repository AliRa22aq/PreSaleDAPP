var PICNICPresale = artifacts.require("PICNICPresale.sol");
// const moment = require('moment');


contract("PICNICPresale", (accounts) => {
  
  let PICNICPresaleInstance;

  it("Check if Contract is deploying fine and initial state is as expectation ", async () =>  {

    const owner = accounts[0];

    PICNICPresaleInstance = await PICNICPresale.deployed()

  })

})