var Presale = artifacts.require("Presale.sol");
var ERC20 = artifacts.require("PresaleToken.sol");
var PICNIC = artifacts.require("PICNIC.sol");
// const moment = require('moment');


contract("Presale", (accounts) => {
  
  let presaleContract;
  let erc20;
  let picnicToken;

  let presaleContractAddress;
  let erc20Address;
  let picnicTokenAddress;

  let upfrontFee;
  let salesFeeInPercent;

  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];


  beforeEach(async () => {
    presaleContract = await Presale.new();
    presaleContractAddress = await presaleContract.address;

    upfrontFee = await presaleContract.upfrontfee();
    salesFeeInPercent = await presaleContract.salesFeeInPercent();

    erc20 = await ERC20.new();
    erc20Address = await erc20.address;

    picnicToken = await PICNIC.new();
    picnicTokenAddress = await picnicToken.address;

  });

  describe("Deployment =>", async () => {

    it("deploys successfully", async () => {
 
      assert.notEqual(presaleContractAddress, 0x0);
      assert.notEqual(presaleContractAddress, "");

      assert.notEqual(erc20Address, 0x0);
      assert.notEqual(erc20Address, "");
      
      assert.notEqual(picnicTokenAddress, 0x0);
      assert.notEqual(picnicTokenAddress, "");

    });
      
    it("contains no sale data", async () => {
      const count = await presaleContract.count();
      assert.equal(count, 0);
    });
    
  });
    
    
  describe("Presale =>", () => {

    describe("as owner", () => {

      it("should not be possible to start a presale without approving proper tokens to the contract", async () => {
                  
        let err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: owner })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20._mint(owner, 16000);
        await erc20.approve(presaleContractAddress, 16000);
        
        err = false;
        
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: owner })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20.approve(presaleContractAddress, 0)

      });
      
      
      it("should be possible to start a presale without any fee", async () => {
                  
        await erc20._mint(owner, 17000);
        await erc20.approve(presaleContractAddress, 17000);
        await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000)      

        const count = await presaleContract.count();
        assert.equal(count, 1);

      });

    })

    describe("as user", () => {

      it("should not be possible to start a presale without approving proper tokens to the contract", async () => {
                  
        let err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: user1 })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20._mint(user1, 16000, { from: user1 });
        await erc20.approve(presaleContractAddress, 16000, { from: user1 });
        
        err = false;
        
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: user1 })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20.approve(presaleContractAddress, 0, { from: user1 })

      });

      it("should not be possible to start a presale without paying fee", async () => {

        await erc20._mint(user1, 17000, { from: user1 });
        await erc20.approve(presaleContractAddress, 17000, { from: user1 });

        let err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: user1 })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);


        err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: user1, value: 50})      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

      });
  
      it("should be possible to start a presale by paying proper fee", async () => {
  
        await erc20._mint(user1, 17000, { from: user1 });
        await erc20.approve(presaleContractAddress, 17000, { from: user1 });
        
        await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [0,0] ,[500, 1000], 8000, { from: user1, value: 100})      
      
        const count = await presaleContract.count();
        assert.equal(count, 1);
  
  
      });

    })

    describe("as a whitelisted user", () => {

      it("No one other than owner can whitelist users to start a free presale", async () => {
                  
        let err = false;
        try {
          await presaleContract.whiteListUsersToStartProject(user2, { from: user2 })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

      });

      it("Only owner can whitelist users to start a free presale", async () => {
                  
        await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
        const isWhiteListed = await presaleContract.isUserWhitelistedToStartProject(user2);
        assert.equal(isWhiteListed, true);
        
        
      });

      it("Whitelisted users can start a presale without paying upfront fee", async () => {

        await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                  
        await erc20._mint(user2, 34000, { from: user2 });
        await erc20.approve(presaleContractAddress, 34000, { from: user2 });
        
        await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 20000, 1, 0, [0,0] ,[500, 1000], 8000, { from: user2})      
      
        const count = await presaleContract.count();
        assert.equal(count, 1);

      });

    })

  })


})