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

  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];

  let now;

  const startASale = async (type, user, fee) => {

    await erc20._mint(user, 34000, { from: user });
    await erc20.approve(presaleContractAddress, 34000, { from: user });
    
    await presaleContract.setPresale(type, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user, value: fee})      
  }

  const runningSale = async (type, user, fee, criteriaToken=erc20Address, _minTokensForParticipation=0) => {

    await erc20._mint(user, 34000, { from: user });
    await erc20.approve(presaleContractAddress, 34000, { from: user });
    
    await presaleContract.setPresale(type, erc20Address, criteriaToken, 70, 20000, 100, _minTokensForParticipation, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user, value: fee})      

    const count = await presaleContract.count();
    assert.equal(count, 1);

    const info = await presaleContract.presaleInfo(1);
    assert.equal(info.preSaleStatus, 1);

    return count;
  }

  beforeEach(async () => {
    presaleContract = await Presale.new();
    presaleContractAddress = await presaleContract.address;

    // upfrontFee = await presaleContract.upfrontfee();
    // salesFeeInPercent = await presaleContract.salesFeeInPercent();

    erc20 = await ERC20.new();
    erc20Address = await erc20.address;

    picnicToken = await PICNIC.new();
    picnicTokenAddress = await picnicToken.address;

    now = (Date.now()/1000).toFixed()

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
    
  describe("Owner's privilege =>", async () => {

    it("owner can update the overall fees", async () => {

        const Upfrontfee = await presaleContract.upfrontfee(); // 100;
        const fee = await presaleContract.salesFeeInPercent(); // = 2;

        assert.equal(Upfrontfee, 100);
        assert.equal(fee, 2);
    
        await presaleContract.updateFees(200, 3)

        const UpfrontfeeAfter = await presaleContract.upfrontfee(); // 200;
        const feeAfter = await presaleContract.salesFeeInPercent(); // = 3;

        assert.equal(UpfrontfeeAfter, 200);
        assert.equal(feeAfter, 3);

        
    });
    
    it("owner can update the salesFeeInPercent of any running project", async () => {

        // const now = (Date.now()/1000).toFixed()
        
        await erc20._mint(user1, 17000, { from: user1 });
        await erc20.approve(presaleContractAddress, 17000, { from: user1 });
        
        await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
      
        const count = await presaleContract.count();
        assert.equal(count, 1);

        const existingFee = await presaleContract.salesFeeInPercentForAProject(1);
        assert.equal(existingFee, 2);

    
        await presaleContract.updateSalesFeeInPercentForAProject(1, 5)

        const NewFee = await presaleContract.salesFeeInPercentForAProject(1);
        assert.equal(NewFee, 5);

        
    });

    it("Only owner can whitelist users to start a free presale", async () => {
      // const now = (Date.now()/1000).toFixed()
                    
      await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
      const isWhiteListed = await presaleContract.isUserWhitelistedToStartProject(user2);
      assert.equal(isWhiteListed, true);

      await erc20._mint(user2, 17000, { from: user2 });
      await erc20.approve(presaleContractAddress, 17000, { from: user2 });
      
      await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user2})      
    
      const count = await presaleContract.count();
      assert.equal(count, 1);

    });

    it("No one other than owner can whitelist users to start a free presale", async () => {
                  
      let err = false;
      try {
        await presaleContract.whiteListUsersToStartProject(user2, { from: user2 })      
      } catch (e) {
          err = true;
      }
      assert.equal(err, true);

    });

    it("owner can whitelist users to start a presale without any fee", async () => {
      // const now = (Date.now()/1000).toFixed()
    
      await erc20._mint(user1, 17000, { from: user1 });
      await erc20.approve(presaleContractAddress, 17000, { from: user1 });
      
      await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
    
      const count = await presaleContract.count();
      assert.equal(count, 1);

      const existingFee = await presaleContract.salesFeeInPercentForAProject(1);
      assert.equal(existingFee, 2);

  
      await presaleContract.updateSalesFeeInPercentForAProject(1, 5)

      const NewFee = await presaleContract.salesFeeInPercentForAProject(1);
      assert.equal(NewFee, 5);

      
    });

    it("No one other than owner can update the overall fees", async () => {

        const Upfrontfee = await presaleContract.upfrontfee(); // 100;
        const fee = await presaleContract.salesFeeInPercent(); // = 2;

        assert.equal(Upfrontfee, 100);
        assert.equal(fee, 2);
    
        let err = false;
        try {
          await presaleContract.updateFees(200, 3, {from: user1});
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);
        
    });

    it("No one other than owner can update the salesFeeInPercent of any running project", async () => {

      await erc20._mint(user1, 17000, { from: user1 });
      await erc20.approve(presaleContractAddress, 17000, { from: user1 });
      
      await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
    
      const count = await presaleContract.count();
      assert.equal(count, 1);

      const existingFee = await presaleContract.salesFeeInPercentForAProject(1);
      assert.equal(existingFee, 2);
      
      let err = false;
      try {
          await presaleContract.updateSalesFeeInPercentForAProject(1, 5, {from: user1})
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);
        
    });

  });

  describe("Presale =>", () => {

    describe("as owner", () => {

      it("should not be possible to start a presale without approving proper tokens to the contract", async () => {
                  
        let err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: owner })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20._mint(owner, 16000);
        await erc20.approve(presaleContractAddress, 16000);
        
        err = false;
        
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: owner })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20.approve(presaleContractAddress, 0)

      });
      
      
      describe("should be possible to start", () => {

        it("an open presale", async () => {
                    
          await erc20._mint(owner, 17000);
          await erc20.approve(presaleContractAddress, 17000);
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000)      
  
          const count = await presaleContract.count();
          assert.equal(count, 1);
  
        });
        
        it("an only Whitelist presale", async () => {
                    
          await erc20._mint(owner, 17000);
          await erc20.approve(presaleContractAddress, 17000);
          await presaleContract.setPresale(1, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000)      

          const count = await presaleContract.count();
          assert.equal(count, 1);

        });

        it("an only tokenholder presale", async () => {
                    
          await erc20._mint(owner, 17000);
          await erc20.approve(presaleContractAddress, 17000);
          await presaleContract.setPresale(2, erc20Address, picnicTokenAddress, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000)      

          const count = await presaleContract.count();
          assert.equal(count, 1);

        });
      
      })

    })

    describe("as user", () => {

      it("should not be possible to start a presale without approving proper tokens to the contract", async () => {
                  
        let err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1 })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

        await erc20._mint(user1, 16000, { from: user1 });
        await erc20.approve(presaleContractAddress, 16000, { from: user1 });
        
        err = false;
        
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1 })      
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
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1 })      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);


        err = false;
        try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 50})      
        } catch (e) {
            err = true;
        }
        assert.equal(err, true);

      });
  
      describe("should be possible to start", () => {

        it("an open presale", async () => {

          await erc20._mint(user1, 17000, { from: user1 });
          await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
        
          const count = await presaleContract.count();
          assert.equal(count, 1);
  
        });
        
        it("an only Whitelist presale", async () => {
                    
          await erc20._mint(user1, 17000, { from: user1 });
          await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          await presaleContract.setPresale(1, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      

          const count = await presaleContract.count();
          assert.equal(count, 1);

        });

        it("an only tokenholder presale", async () => {
                    
          await erc20._mint(user1, 17000, { from: user1 });
          await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          await presaleContract.setPresale(2, erc20Address, picnicTokenAddress, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
          const count = await presaleContract.count();
          assert.equal(count, 1);

        });
      
      })

    })

    describe("as a whitelisted user", () => {

      describe("should be possible to start", () => {

        it("an open presale", async () => {

          await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                    
          await erc20._mint(user2, 34000, { from: user2 });
          await erc20.approve(presaleContractAddress, 34000, { from: user2 });
          
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user2})      
        
          const count = await presaleContract.count();
          assert.equal(count, 1);
  
        });
        
        it("an only Whitelist presale", async () => {
                    
          await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                    
          await erc20._mint(user2, 34000, { from: user2 });
          await erc20.approve(presaleContractAddress, 34000, { from: user2 });
          
          await presaleContract.setPresale(1, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user2})      
        
          const count = await presaleContract.count();
          assert.equal(count, 1);

        });

        it("an only tokenholder presale", async () => {
                    
          await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                    
          await erc20._mint(user2, 34000, { from: user2 });
          await erc20.approve(presaleContractAddress, 34000, { from: user2 });
          
          await presaleContract.setPresale(2, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user2})      
        
          const count = await presaleContract.count();
          assert.equal(count, 1);

        });
      
      })

    })

    describe("as a participant", () => {

      it("can not buy a token from an invalid presale", async () => {

        // const saleID = await runningSale(0, user1, 100);

        
        let err = false;
        try {
          await presaleContract.buyTokensOnPresale(500, 500, {from: user2});
        }
        catch(error){
          // console.log(error.reason)
          err = true;
        }
        assert.equal(err, true);

      })

      it("can not buy a token before presale starts", async () => {

        const saleID = await runningSale(0, user1, 100);

        let err = false;
        try {
          await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2});
        }
        catch(error){
          // console.log(error.reason)
          err = true;
        }
        assert.equal(err, true);

      })

      describe("once presale starts", () => {

        it("can not buy tokens without paying as per price of each token", async () => {

          const saleID = await runningSale(0, user1, 100);
          await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

          // const info = await presaleContract.presaleInfo(saleID);
          // console.log(String(info.priceOfEachToken));


          let err = false;
          try {
            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "0"});
          }
          catch(error){
            // console.log(error.reason)
            err = true;
          }
          assert.equal(err, true);

        })

        it("can not buy tokens less than minimum limit", async () => {

          const saleID = await runningSale(0, user1, 100);
          await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

          // const criteria = await presaleContract.presaleParticipationCriteria(saleID);
          // console.log(String(criteria.reqestedTokens.minTokensReq));


          let err = false;
          try {
            await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
          }
          catch(error){
            // console.log(error.reason)
            err = true;
          }
          assert.equal(err, true);

        })

        it("can not buy tokens more than maximum limit", async () => {

          const saleID = await runningSale(0, user1, 100);
          await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

          // const criteria = await presaleContract.presaleParticipationCriteria(saleID);
          // console.log(String(criteria.reqestedTokens.minTokensReq));


          let err = false;
          try {
            await presaleContract.buyTokensOnPresale(saleID, 1100, {from: user2, value: "110000"});
          }
          catch(error){
            // console.log(error.reason)
            err = true;
          }
          assert.equal(err, true);

        })

        it("can buy tokens in multiple steps but still can't exceed max limit", async () => {

          const saleID = await runningSale(0, user1, 100);
          await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

          // const criteria = await presaleContract.presaleParticipationCriteria(saleID);
          // console.log(String(criteria.reqestedTokens.minTokensReq));

          await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "500000"});
          await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "300000"});
          await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "200000"});            
          
          let err = false;
          try {
            await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "200000"});
          }
          catch(error){
            // console.log(error.reason)
            err = true;
          }
          assert.equal(err, true);

        })


        describe("in an Open sale", () => {

          it("can buy tokens by meeting all criterias", async () => {

            const saleID = await runningSale(0, user1, 100);
            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "500000"});
            await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "300000"});
            await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "200000"});
            
          })

          it("participant's contributions should reflect in the data properly", async () => {

            const saleID = await runningSale(0, user1, 100);
            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
            await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
            await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});

            const participant = await presaleContract.participant(saleID, user2);

            assert.equal(participant.value, 100000);
            assert.equal(participant.tokens, 1000);
            assert.equal(participant.whiteListed, false);
            
          })
        
        })

        describe("in an only whitelist sale", () => {

          it("can not participate in sale if is not whitelisted", async () => {

            const saleID = await runningSale(1, user1, 100);

            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            let err = false;
            try {
              await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
            }
            catch(error){
              // console.log(error.reason)
              err = true;
            }
            assert.equal(err, true);
            
          })

          it("can participate in sale if is whitelisted", async () => {

            // const runningSale = async (type, user, fee, criteriaToken, 250)

            const saleID = await runningSale(1, user1, 100);

            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            await presaleContract.whiteListUsersToBuyTokens(saleID, user2, {from: user1});
            await presaleContract.whiteListUsersToBuyTokens(saleID, user3, {from: user1});

            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
            await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
            
          })

          it("participant's contributions should reflect in the data properly", async () => {

            const saleID = await runningSale(1, user1, 100);

            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            await presaleContract.whiteListUsersToBuyTokens(saleID, user2, {from: user1});
            await presaleContract.whiteListUsersToBuyTokens(saleID, user3, {from: user1});

            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
            await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
            
            await presaleContract.buyTokensOnPresale(saleID, 800, {from: user3, value: "80000"});

            const participant2 = await presaleContract.participant(saleID, user2);
            const participant3 = await presaleContract.participant(saleID, user3);

            assert.equal(participant2.value, 80000);
            assert.equal(participant2.tokens, 800);
            assert.equal(participant2.whiteListed, true);

            assert.equal(participant3.value, 80000);
            assert.equal(participant3.tokens, 800);
            assert.equal(participant3.whiteListed, true);

            
          })
        
        })

        describe("in an only token holders sale", () => {

          it("can not participate in sale if he don't have enough criteria tokens", async () => {

            const saleID = await runningSale(2, user1, 100, picnicTokenAddress, 250);

            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            let err = false;
            try {
              await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
            }
            catch(error){
              // console.log(error.reason)
              err = true;
            }
            assert.equal(err, true);
            
            
          })

          it("can participate in sale if he have enough criteria tokens", async () => {

            const saleID = await runningSale(2, user1, 100, picnicTokenAddress, 250);

            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            await picnicToken._mint(user2, 250, { from: user2 })
            
            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});

          })

          it("participant's contributions should reflect in the data properly", async () => {

            const saleID = await runningSale(2, user1, 100, picnicTokenAddress, 250);

            await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

            await picnicToken._mint(user2, 250, { from: user2 })
            await picnicToken._mint(user3, 250, { from: user3 })
            
            await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
            await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
            
            await presaleContract.buyTokensOnPresale(saleID, 800, {from: user3, value: "80000"});

            const participant2 = await presaleContract.participant(saleID, user2);
            const participant3 = await presaleContract.participant(saleID, user3);

            assert.equal(participant2.value, 80000);
            assert.equal(participant2.tokens, 800);
            assert.equal(participant2.whiteListed, false);

            assert.equal(participant3.value, 80000);
            assert.equal(participant3.tokens, 800);
            assert.equal(participant3.whiteListed, false);
            
          })
        
        })

    })


    })


  })








})