var Presale = artifacts.require("Presale.sol");
var ERC20 = artifacts.require("PresaleToken.sol");
var PICNIC = artifacts.require("PICNIC.sol");
var Router = artifacts.require("PancakeRouter.sol");
// const moment = require('moment');


contract("Presale", (accounts) => {
  
  let presaleContract;
  let erc20;
  let picnicToken;

  let presaleContractAddress;
  let erc20Address;
  let picnicTokenAddress;


  let routerContract;
  let routerAddress;

  let now;

  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const user4 = accounts[4];
  const user5 = accounts[5];
  const user6 = accounts[6];
  const user7 = accounts[7];
  const devTeam = accounts[8];
  const dev = accounts[9];

  const delayFn = async (ms) => new Promise((r) => setTimeout(r, ms));


  const startASale = async (type, user, fee) => {

    await erc20._mint(user, 34000, { from: user });
    await erc20.approve(presaleContractAddress, 34000, { from: user });
    
    await presaleContract.setPresale(type, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user, value: fee})      
  }

  const runningSale = async (type, user, fee, criteriaToken=erc20Address, _minTokensForParticipation=0) => {

    await erc20._mint(user, 34000, { from: user });
    await erc20.approve(presaleContractAddress, 34000, { from: user });
    
    await presaleContract.setPresale(type, erc20Address, criteriaToken, 70, 20000, 100, _minTokensForParticipation, [now + 5000,now + 10000] ,[500, 1000], 10000, { from: user, value: fee})  

    const count = await presaleContract.count();
    assert.equal(count, 1);
    // console.log(count)

    const info = await presaleContract.presaleInfo(1);
    assert.equal(info.preSaleStatus, 0);
    // console.log(info.preSaleStatus)

    return count;
  }

  const runningSale2 = async (type, user, fee, tokensOnSale, liquidity ) => {

    const liquidityTokens = tokensOnSale * liquidity / 100
    const totalTokens = tokensOnSale + liquidityTokens;

    await erc20._mint(user, totalTokens, { from: user });
    await erc20.approve(presaleContractAddress, totalTokens, { from: user });
    
    await presaleContract.setPresale(type, erc20Address, erc20Address, liquidity, tokensOnSale, 100, 250, [now + 15*60+5, now + 24*60*60+5] ,[500, 2000], 8000, { from: user, value: fee})      

    const count = await presaleContract.count();
    assert.equal(count, 1);

    const info = await presaleContract.presaleInfo(1);
    assert.equal(info.preSaleStatus, 0);

    return count;
  }

  const fiveMembersBuy1000TokensEach = async (saleID) => {

    
      await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user2, value: "100000"});
      await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "100000"});
      await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user5, value: "100000"});
      await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user6, value: "100000"});
      await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});

      // const participant2 = await presaleContract.participant(saleID, user2);
      // const participant3 = await presaleContract.participant(saleID, user3);
      // const participant4 = await presaleContract.participant(saleID, user4);
      // const participant5 = await presaleContract.participant(saleID, user5);
      // const participant6 = await presaleContract.participant(saleID, user6);

      // assert.equal(participant2.value, 100000);
      // assert.equal(participant2.tokens, 1000);
      // assert.equal(participant2.whiteListed, false);

      // assert.equal(participant3.value, 100000);
      // assert.equal(participant3.tokens, 1000);
      // assert.equal(participant3.whiteListed, false);

      // assert.equal(participant4.value, 100000);
      // assert.equal(participant4.tokens, 1000);
      // assert.equal(participant4.whiteListed, false);

      // assert.equal(participant5.value, 100000);
      // assert.equal(participant5.tokens, 1000);
      // assert.equal(participant5.whiteListed, false);

      // assert.equal(participant6.value, 100000);
      // assert.equal(participant6.tokens, 1000);
      // assert.equal(participant6.whiteListed, false);

  }

  const soldOutSale = async () => {

    routerContract = await Router.new();
    routerAddress = await routerContract.address;

    await presaleContract.setRouterAddr(routerAddress);

    await erc20._mint(user1, 17000, { from: user1 });
    await erc20.approve(presaleContractAddress, 17000, { from: user1 });
    
    await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 15*60+5, now + 24*60*60+5] ,[500, 2000], 7500, { from: user1, value: 100})      

    const saleID = await presaleContract.count();
    assert.equal(saleID, 1);

    const info = await presaleContract.presaleInfo(saleID);
    assert.equal(info.preSaleStatus, 0);

    await presaleContract.updatePresaleTime(saleID, now, now + 35, {from: user1});

    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000"});            
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user6, value: "200000"});            

    let err = false;
    try {
      await presaleContract.buyTokensOnPresale(saleID, 200, {from: user7, value: "20000"});
    }
    catch(error){
      // console.log(error.reason)
      err = true;
    }
    assert.equal(err, true);

    
    return saleID
  }

  const expiredSuccessfullSale = async () => {

    routerContract = await Router.new();
    routerAddress = await routerContract.address;
    await presaleContract.setRouterAddr(routerAddress);

    await erc20._mint(user1, 17000, { from: user1 });
    await erc20.approve(presaleContractAddress, 17000, { from: user1 });
    
    await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 15*60+5, now + 24*60*60+5] ,[500, 2000], 8000, { from: user1, value: 100})      

    const saleID = await presaleContract.count();
    assert.equal(saleID, 1);

    const info = await presaleContract.presaleInfo(saleID);
    assert.equal(info.preSaleStatus, 0);

    await presaleContract.updatePresaleTime(saleID, now, now + 30, {from: user1});

    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
    await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000"});            
    await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user6, value: "100000"});            
  
    await delayFn(12000)

    // console.log("after", Number((Date.now()/1000).toFixed()))

  let err = false;
    try {
      await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
    }
    catch(error){
      // console.log(error.reason)
      err = true;
    }
    assert.equal(err, true);

  
    return saleID
  }

  const expiredUnsuccessfullSale = async () => {

    routerContract = await Router.new();
    routerAddress = await routerContract.address;
    await presaleContract.setRouterAddr(routerAddress);

    await erc20._mint(user1, 17000, { from: user1 });
    await erc20.approve(presaleContractAddress, 17000, { from: user1 });
    
    await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 15*60+5, now + 24*60*60+5] ,[500, 2000], 8000, { from: user1, value: 100})      

    const saleID = await presaleContract.count();
    assert.equal(saleID, 1);

    const info = await presaleContract.presaleInfo(saleID);
    assert.equal(info.preSaleStatus, 0);

    await presaleContract.updatePresaleTime(saleID, now, now + 30, {from: user1});

    await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user2, value: "100000"});
    await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
    await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "100000"});            
    await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user5, value: "100000"});            
    await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user6, value: "100000"});            
  
    await delayFn(12000)

    // console.log("after", Number((Date.now()/1000).toFixed()))

  let err = false;
    try {
      await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
    }
    catch(error){
      // console.log(error.reason)
      err = true;
    }
    assert.equal(err, true);

  
    return saleID
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

    now = Number((Date.now()/1000).toFixed());

  });

  describe("Deployment =>", async () => {

  //   it("deploys successfully", async () => {
 
  //     assert.notEqual(presaleContractAddress, 0x0);
  //     assert.notEqual(presaleContractAddress, "");

  //     assert.notEqual(erc20Address, 0x0);
  //     assert.notEqual(erc20Address, "");
      
  //     assert.notEqual(picnicTokenAddress, 0x0);
  //     assert.notEqual(picnicTokenAddress, "");

  //   });
      
  //   it("contains no sale data", async () => {
  //     const count = await presaleContract.count();
  //     assert.equal(count, 0);
  //   });
    
  });
    
  describe("As a Master ", async () => {

  //   it("should be able to update the overall fees", async () => {
  
  //     const Upfrontfee = await presaleContract.upfrontfee(); // 100;
  //     const fee = await presaleContract.salesFeeInPercent(); // = 2;

  //     assert.equal(Upfrontfee, 100);
  //     assert.equal(fee, 2);
  
  //     await presaleContract.updateFees(200, 3)

  //     const UpfrontfeeAfter = await presaleContract.upfrontfee(); // 200;
  //     const feeAfter = await presaleContract.salesFeeInPercent(); // = 3;

  //     assert.equal(UpfrontfeeAfter, 200);
  //     assert.equal(feeAfter, 3);

      
  // });

  //     it("should be able to whitelist users to start a free presale", async () => {
                      
  //       await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
  //       const isWhiteListed = await presaleContract.isUserWhitelistedToStartProject(user2);
  //       assert.equal(isWhiteListed, true);

  //       await erc20._mint(user2, 17000, { from: user2 });
  //       await erc20.approve(presaleContractAddress, 17000, { from: user2 });
        
  //       await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user2})      
      
  //       const count = await presaleContract.count();
  //       assert.equal(count, 1);

  //     });
      
  // });

  // describe("Users other than master ", async () => {
    
  //     it("should not be able to whitelist users to start a free presale", async () => {
                    
  //       let err = false;
  //       try {
  //         await presaleContract.whiteListUsersToStartProject(user2, { from: user2 })      
  //       } catch (e) {
  //           err = true;
  //       }
  //       assert.equal(err, true);

  //     });

  //     it("should not be able to update the overall fees", async () => {
        
  //       const Upfrontfee = await presaleContract.upfrontfee(); // 100;
  //       const fee = await presaleContract.salesFeeInPercent(); // = 2;
        
  //       assert.equal(Upfrontfee, 100);
  //         assert.equal(fee, 2);
      
  //         let err = false;
  //         try {
  //           await presaleContract.updateFees(200, 3, {from: user1});
  //         } catch (e) {
  //             err = true;
  //         }
  //         assert.equal(err, true);
          
  //     });

  //     it("should not be able to update the salesFeeInPercent of any running project", async () => {

  //       await erc20._mint(user1, 17000, { from: user1 });
  //       await erc20.approve(presaleContractAddress, 17000, { from: user1 });
        
  //       await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
      
  //       const count = await presaleContract.count();
  //       assert.equal(count, 1);

  //       const existingFee = await presaleContract.salesFeeInPercentForAProject(1);
  //       assert.equal(existingFee, 2);
        
  //       let err = false;
  //       try {
  //           await presaleContract.updateSalesFeeInPercentForAProject(1, 5, {from: user1})
  //         } catch (e) {
  //             err = true;
  //         }
  //         assert.equal(err, true);
          
  //     });

  //       it("should be able to update the dev team address at any time", async () => {

  //       // const teamAddr = await presaleContract.teamAddr();
  //       // console.log(teamAddr);
  //       // const devAddr = await presaleContract.devAddr();
  //       // console.log(devAddr);

  //       await presaleContract.updateteamAddr(owner);

  //       const teamAddr_after_update = await presaleContract.teamAddr();
  //       assert.equal(teamAddr_after_update, owner);


          
  //     });

  })

  describe("Presale initialization ", () => {

    describe("Contract", () => {
      
  //     it("should reflect the sale information in right way", async () => {

  //       const saleID = await runningSale(0, user1, 100);

  //       const info = await presaleContract.presaleInfo(saleID); 
  //       const criteria = await presaleContract.presaleParticipationCriteria(saleID);

  //       assert.equal(info.typeOfPresale, 0);
  //       assert.equal(info.preSaleContractAddr, erc20Address);
  //       assert.equal(info.presaleOwnerAddr, user1);
  //       assert.equal(info.priceOfEachToken, 100);
  //       assert.equal(info.tokensForSale, 20000);
  //       assert.equal(info.reservedTokensPCForLP, 70);
  //       assert.equal(info.remainingTokensForSale, 20000);
  //       assert.equal(info.accumulatedBalance, 0);
  //       assert.equal(info.preSaleStatus, 0);

  //       assert.equal(criteria.preSaleContractAddr, erc20Address);
  //       assert.equal(criteria.criteriaTokenAddr, erc20Address);
  //       assert.equal(criteria.minTokensForParticipation, 0);
  //       assert.equal(criteria.reqestedTokens.minTokensReq, 500);
  //       assert.equal(criteria.reqestedTokens.maxTokensReq, 1000);
  //       assert.equal(criteria.softCap, 10000);
  //       assert.equal(criteria.presaleTimes.startedAt, now + 5000);
  //       assert.equal(criteria.presaleTimes.expiredAt, now + 10000);
        
  //     })

    })
    
    describe("as master of the contract", () => {
      
      describe("should be able to", () => {
        
  //       it("start an open presale without fee", async () => {
                    
  //         await erc20._mint(owner, 17000);
  //         await erc20.approve(presaleContractAddress, 17000);
  //         await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000)      
  
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);
  
  //       });

  //       it("start an only Whitelist presale without fee", async () => {
                    
  //         await erc20._mint(owner, 17000);
  //         await erc20.approve(presaleContractAddress, 17000);
  //         await presaleContract.setPresale(1, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000)      

  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });

  //       it("start an only tokenholder presale without fee", async () => {
                    
  //         await erc20._mint(owner, 17000);
  //         await erc20.approve(presaleContractAddress, 17000);
  //         await presaleContract.setPresale(2, erc20Address, picnicTokenAddress, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000)      

  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });
      

      })

      describe("should not be able to", () => {
        
  //         it("start a presale without approving proper tokens to the contract", async () => {
                      
  //           let err = false;
  //           try {
  //             await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: owner })      
  //           } catch (e) {
  //               err = true;
  //           }
  //           assert.equal(err, true);
    
  //           await erc20._mint(owner, 16000);
  //           await erc20.approve(presaleContractAddress, 16000);
            
  //           err = false;
            
  //           try {
  //             await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: owner })      
  //           } catch (e) {
  //               err = true;
  //           }
  //           assert.equal(err, true);
    
  //           await erc20.approve(presaleContractAddress, 0)
    
  //         });
        
      })     

    })

    describe("as owner of the sale", () => {

      describe("should not be able to ", () => {
      
  //       it("start a presale without approving proper tokens to the contract", async () => {
                    
  //         let err = false;
  //         try {
  //           await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1 })      
  //         } catch (e) {
  //             err = true;
  //         }
  //         assert.equal(err, true);

  //         await erc20._mint(user1, 16000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 16000, { from: user1 });
          
  //         err = false;
          
  //         try {
  //           await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1 })      
  //         } catch (e) {
  //             err = true;
  //         }
  //         assert.equal(err, true);

  //         await erc20.approve(presaleContractAddress, 0, { from: user1 })

  //       });

  //       it("start a presale without paying fee", async () => {

  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });

  //         let err = false;
  //         try {
  //           await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1 })      
  //         } catch (e) {
  //             err = true;
  //         }
  //         assert.equal(err, true);


  //         err = false;
  //         try {
  //           await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 50})      
  //         } catch (e) {
  //             err = true;
  //         }
  //         assert.equal(err, true);

  //       });

  //       it("start a presale with less 50% soft cap", async () => {

  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });

  //         let err = false;
  //         try {
  //           await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 4999, { from: user1, value: 100 })      
  //         } catch (e) {
  //       //      console.log(e.reason)
  //             err = true;
  //         }
  //         assert.equal(err, true);

  //       });
    
  //       it("start a presale with less 50% liquidity tokens", async () => {

  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });

  //         let err = false;
  //         try {
  //           await presaleContract.setPresale(0, erc20Address, erc20Address, 49, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 4999, { from: user1, value: 100 })      
  //         } catch (e) {
  //             // console.log(e.reason)
  //             err = true;
  //         }
  //         assert.equal(err, true);

  //       });



  //       it("update the participation criteria with less than 50% softcap even before sale", async () => {

  //         const saleID = await runningSale2(0, user1, 100, 10000, 70);
          
  //         const info = await presaleContract.presaleInfo(saleID);
  //         const criteria = await presaleContract.presaleParticipationCriteria(saleID);
          
  //         assert.equal(info.preSaleStatus, 0);
  //         assert.equal(info.priceOfEachToken, 100);
  //         assert.equal(criteria.reqestedTokens.minTokensReq, 500);
  //         assert.equal(criteria.reqestedTokens.maxTokensReq, 2000);
  //         assert.equal(criteria.softCap, 8000);
          
          
          
  //         let err = false;
  //         try {
  //           await presaleContract.updateParticipationCriteria(saleID, 50, 1000, 2500, 4999, {from: user1});
  //         } catch (e) {
  //             // console.log(e.reason)
  //             err = true;
  //         }
  //         assert.equal(err, true);

  //       })


        it("start a sale starting at just now", async () => {

            await erc20._mint(user1, 17000, { from: user1 });
            await erc20.approve(presaleContractAddress, 17000, { from: user1 });
            
            // console.log(now)


            let err = false;
            try {
            await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 0, [now + 15*59, now + 24*60*60+5] ,[500, 2000], 8000, { from: user1, value: 100})              
            } catch (e) {
              console.log(e.reason)
              err = true;
          }
          assert.equal(err, true);

        })

        it("start a sale with expiry time less than 24 hours from now", async () => {

          await erc20._mint(user1, 17000, { from: user1 });
          await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
          // console.log(now)


          let err = false;
          try {
          await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 0, [now + 15*60+5, now + 24*59*60] ,[500, 2000], 8000, { from: user1, value: 100})              
          } catch (e) {
            console.log(e.reason)
            err = true;
        }
        assert.equal(err, true);

      })

      })

      describe("should be able to ", () => {

  //       it("change the participation criteria only before the sale begins", async () => {

  //         const saleID = await runningSale2(0, user1, 100, 10000, 70);

          
  //         const info = await presaleContract.presaleInfo(saleID);
  //         const criteria = await presaleContract.presaleParticipationCriteria(saleID);
          
  //         assert.equal(info.preSaleStatus, 0);
  //         assert.equal(info.priceOfEachToken, 100);
  //         assert.equal(criteria.reqestedTokens.minTokensReq, 500);
  //         assert.equal(criteria.reqestedTokens.maxTokensReq, 2000);
  //         assert.equal(criteria.softCap, 8000);
          
          
  //         await presaleContract.updatePresaleTime(saleID, now+100, now + 10000, {from: user1});

  //         // const info5 = await presaleContract.presaleInfo(saleID);
  //         // console.log(Number(info5.preSaleStatus));

  //         await presaleContract.updateParticipationCriteria(saleID, 50, 1000, 2500, 7000, {from: user1});

  //         const info2 = await presaleContract.presaleInfo(saleID);
  //         const criteria2 = await presaleContract.presaleParticipationCriteria(saleID);
  //         // console.log(Number(info2.preSaleStatus));

  //         assert.equal(info2.preSaleStatus, 0);
  //         assert.equal(info2.priceOfEachToken, 50);
  //         assert.equal(criteria2.reqestedTokens.minTokensReq, 1000);
  //         assert.equal(criteria2.reqestedTokens.maxTokensReq, 2500);
  //         assert.equal(criteria2.softCap, 7000);

  //       })

  //       it("start an open presale", async () => {

  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
  //         await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
        
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });
        
  //       it("start an only Whitelist presale", async () => {
                    
  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });
  //         await presaleContract.setPresale(1, erc20Address, erc20Address, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      

  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });

  //       it("start an only tokenholder presale", async () => {
                    
  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });
  //         await presaleContract.setPresale(2, erc20Address, picnicTokenAddress, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });
      
  //       it("delete the presale before it begins", async () => {
                    
  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });
  //         await presaleContract.setPresale(2, erc20Address, picnicTokenAddress, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);


  //         await presaleContract.deletePresaleContractInfo(1, {from :user1});

  //         const info = await presaleContract.presaleInfo(1);
  //         // console.log(info)
  //         // console.log("info.preSaleContractAddr => ", info.preSaleContractAddr)
  //         assert.equal(info.preSaleContractAddr, '0x0000000000000000000000000000000000000000');

  //       });

          it("start a sale with starting time 15 minutes from now and expiry time 24 hours from now ", async () => {

            await erc20._mint(user1, 17000, { from: user1 });
            await erc20.approve(presaleContractAddress, 17000, { from: user1 });
            
            await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 0, [now + 15*60+5, now + 24*60*60+5] ,[500, 2000], 8000, { from: user1, value: 100})              
            
            const info = await presaleContract.presaleInfo(1);
            assert.equal(info.preSaleStatus, 0);
        
            
            // let err = false;
            // try {
            // } catch (e) {
            //   console.log(e.reason)
            //   err = true;
            // }
            // assert.equal(err, true);

        })

      })

    })

    describe("as a whitelisted user", () => {

      describe("should be able to ", () => {

  //       it("start an open presale", async () => {

  //         await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                    
  //         await erc20._mint(user2, 34000, { from: user2 });
  //         await erc20.approve(presaleContractAddress, 34000, { from: user2 });
          
  //         await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 10000, { from: user2})      
        
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);
  
  //       });
        
  //       it("start an only Whitelist presale", async () => {
                    
  //         await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                    
  //         await erc20._mint(user2, 34000, { from: user2 });
  //         await erc20.approve(presaleContractAddress, 34000, { from: user2 });
          
  //         await presaleContract.setPresale(1, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 10000, { from: user2})      
        
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });

  //       it("start an only tokenholder presale", async () => {
                    
  //         await presaleContract.whiteListUsersToStartProject(user2, { from: owner })
                    
  //         await erc20._mint(user2, 34000, { from: user2 });
  //         await erc20.approve(presaleContractAddress, 34000, { from: user2 });
          
  //         await presaleContract.setPresale(2, erc20Address, erc20Address, 70, 20000, 1, 0,  [now + 5000,now + 10000] ,[500, 1000], 10000, { from: user2})      
        
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //       });
      
      })

    }) 

  })   
    
  describe("Once presale starts", () => {

    describe("Contract", () => {
      
  //     it("should reflect the partipant's contribution in right way", async () => {

  //       const saleID = await runningSale(0, user1, 100);
        
  //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //       // await fiveMembersBuy500Tokens(saleID);

  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "50000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "50000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user5, value: "50000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user6, value: "50000"});

  //       const participant2 = await presaleContract.participant(saleID, user2);
  //       const participant3 = await presaleContract.participant(saleID, user3);
  //       const participant4 = await presaleContract.participant(saleID, user4);
  //       const participant5 = await presaleContract.participant(saleID, user5);
  //       const participant6 = await presaleContract.participant(saleID, user6);

  //     //     assert.equal(NewFee, 5);


  //       assert.equal(participant2.value, 50000);
  //       assert.equal(participant2.tokens, 500);
  //       assert.equal(participant2.whiteListed, false);

  //       assert.equal(participant3.value, 50000);
  //       assert.equal(participant3.tokens, 500);
  //       assert.equal(participant3.whiteListed, false);

  //       assert.equal(participant4.value, 50000);
  //       assert.equal(participant4.tokens, 500);
  //       assert.equal(participant4.whiteListed, false);

  //       assert.equal(participant5.value, 50000);
  //       assert.equal(participant5.tokens, 500);
  //       assert.equal(participant5.whiteListed, false);

  //       assert.equal(participant6.value, 50000);
  //       assert.equal(participant6.tokens, 500);
  //       assert.equal(participant6.whiteListed, false);

  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "50000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "50000"});


  //       const participant2_2 = await presaleContract.participant(saleID, user2);
  //       const participant3_2 = await presaleContract.participant(saleID, user3);
  //       const participant4_2 = await presaleContract.participant(saleID, user4);


  //       assert.equal(participant2_2.value, 100000);
  //       assert.equal(participant2_2.tokens, 1000);

  //       assert.equal(participant3_2.value, 100000);
  //       assert.equal(participant3_2.tokens, 1000);

  //       assert.equal(participant4_2.value, 100000);
  //       assert.equal(participant4_2.tokens, 1000);

  //     })

  //     it("should reflect the contributions of participants properly", async ()=> {
  //       const saleID = await runningSale(0, user1, 100);
        
  //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //       await fiveMembersBuy1000TokensEach(saleID);

  //       const info = await presaleContract.presaleInfo(saleID);

  //       assert.equal(info.preSaleStatus, 1)
  //       assert.equal(info.remainingTokensForSale, 15000)
  //       assert.equal(info.accumulatedBalance, 500000)

  //       const counts = await presaleContract.presalectCounts(saleID);
  //       assert.equal(counts.participantsCount, 5)
  //       assert.equal(counts.claimsCount, 0)

  //     })

  //     it("should not allow owner to end the sale if it is not ended yet", async ()=> {

  //       const saleID = await runningSale2(0, user1, 100, 10000, 60 );

  //       // console.log("now =>", now)
  //       await presaleContract.updatePresaleTime(saleID, now, now + 30, {from: user1});

  //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user2, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "100000"});            

  //       let err = false;
  //       try {
  //         await presaleContract.endPresale(saleID, {from: user1});
  //       }
  //       catch(error){
  //         console.log(error.reason)
  //         err = true;
  //       }
  //       assert.equal(err, true);
  
  //     })


  //     it("should add the contributions to the contrant balance", async ()=> {

  //       const balance0 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance0))
  //       assert.equal(balance0, 0);

  //       await erc20._mint(user1, 34000);
  //       await erc20.approve(presaleContractAddress, 34000, { from: user1 });
        
  //       await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 20000, 100, 0, [now + 5000,now + 10000] ,[500, 1000], 10000, { from: user1, value: 100})  
    
  //       const balance1 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance1))
  //       assert.equal(balance1, 100);


  //       const saleID = await presaleContract.count();
  //       assert.equal(saleID, 1);
    
  //       await presaleContract.updatePresaleTime(saleID, now, now + 30, {from: user1});

  //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user2, value: "100000"});
  //       const balance2 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance2))
  //       assert.equal(balance2, 100100);

  //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
  //       const balance3 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance3))
  //       assert.equal(balance3, 200100);

  //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "100000"});            
  //       const balance4 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance4))
  //       assert.equal(balance4, 300100);


  //       await erc20._mint(user2, 17000);
  //       await erc20.approve(presaleContractAddress, 17000, { from: user2 });
        
  //       await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 200, 0, [now + 5000, now + 10000] ,[500, 1000], 8000, { from: user2, value: 200})  
    
  //       const balance0_2 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance0_2))
  //       assert.equal(balance0_2, 300300);

  //       const saleID2 = await presaleContract.count();
  //       assert.equal(saleID2, 2);
    
  //       await presaleContract.updatePresaleTime(saleID2, now, now + 30, {from: user2});

  //       await presaleContract.buyTokensOnPresale(saleID2, 1000, {from: user2, value: "200000"});
  //       const balance2_2 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance2_2))
  //       assert.equal(balance2_2, 500300);

  //       await presaleContract.buyTokensOnPresale(saleID2, 1000, {from: user3, value: "200000"});
  //       const balance3_2 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance3_2))
  //       assert.equal(balance3_2, 700300);

  //       await presaleContract.buyTokensOnPresale(saleID2, 1000, {from: user4, value: "200000"});            
  //       const balance4_2 = await presaleContract.BNBbalanceOfContract();
  //       // console.log(String(balance4_2))
  //       assert.equal(balance4_2, 900300);
  
  //     })
    

  //     it("should reflect count of participants properly", async () => {
          
  //       const saleID = await runningSale2(0, user1, 100, 10000, 60 );

  //       await presaleContract.updatePresaleTime(saleID, now, now + 1000, {from: user1});

  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "100000"});            

  //       const counts = await presaleContract.presalectCounts(saleID);
  //       assert.equal(counts.participantsCount, 3)
  //       assert.equal(counts.claimsCount, 0)

  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "100000"});            
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user5, value: "100000"});            
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user6, value: "100000"});

  //       const counts2 = await presaleContract.presalectCounts(saleID);
  //       assert.equal(counts2.participantsCount, 5)
  //       assert.equal(counts2.claimsCount, 0)


  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "100000"});            
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user5, value: "100000"});            
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user6, value: "100000"});
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user7, value: "100000"});

  //       const counts3 = await presaleContract.presalectCounts(saleID);
  //       assert.equal(counts3.participantsCount, 6)
  //       assert.equal(counts3.claimsCount, 0)


  //     })  



    })
    
    describe("as the master", () => {
      
  //     it("should be able to update the salesFeeInPercent of any running project", async () => {
         
  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
  //         await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 0, [now + 5000,now + 10000] ,[500, 1000], 8000, { from: user1, value: 100})      
  //         await presaleContract.updatePresaleTime(1, now, now + 10000, {from: user1});
  
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);
  
  //         const existingFee = await presaleContract.salesFeeInPercentForAProject(1);
  //         assert.equal(existingFee, 2);
  
  //         await presaleContract.buyTokensOnPresale(1, 500, {from: user2, value: "50000"});
      
  //         await presaleContract.updateSalesFeeInPercentForAProject(1, 5)
  
  //         const NewFee = await presaleContract.salesFeeInPercentForAProject(1);
  //         assert.equal(NewFee, 5);
  
          
  //     });
    
    })
    
    describe("as an Owner", () => {

  //       it("should not be able to change the participation criteria once the sale begins", async () => {

  //         const saleID = await runningSale2(0, user1, 100, 10000, 70);
  //         await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //         await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user1, value: "200000"});
          
  //         const info = await presaleContract.presaleInfo(saleID);
          
  //         assert.equal(info.preSaleStatus, 1);

  //         let err = false;
  //         try {
  //           await presaleContract.updatePresaleTime(saleID, now + 10000, now + 100000, {from: user1});
  //         }
  //         catch(error){
  //           // console.log(error.reason)
  //           err = true;
  //         }
  //         assert.equal(err, true);


  //         err = false;
  //         try {
  //           await presaleContract.updateParticipationCriteria(saleID, 100, 800, 1500, 7500, {from: user1});
  //         }
  //         catch(error){
  //           // console.log(error.reason)
  //           err = true;
  //         }
  //         assert.equal(err, true);

  //       })

  //       it("should not be able to delete the presale after it begins", async () => {
                      
  //         await erc20._mint(user1, 17000, { from: user1 });
  //         await erc20.approve(presaleContractAddress, 17000, { from: user1 });
  //         await presaleContract.setPresale(0, erc20Address, picnicTokenAddress, 70, 10000, 1, 0,  [now + 5000,now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
  //         const count = await presaleContract.count();
  //         assert.equal(count, 1);

  //         await presaleContract.updatePresaleTime(1, now, now + 10000, {from: user1});


  //         await presaleContract.buyTokensOnPresale(1, 2000, {from: user2, value: "200000"});

  //         err = false;
  //         try {
  //           await presaleContract.deletePresaleContractInfo(1, {from :user1});
  //         }
  //         catch(error){
  //           // console.log(error.reason)
  //           err = true;
  //         }
  //         assert.equal(err, true);

  //       });

    })
    
    describe("as a participant", () => {

  //   it("should not be able to buy a token from an invalid presale", async () => {

  //     // const saleID = await runningSale(0, user1, 100);

      
  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(500, 500, {from: user2});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })

  //   it("should not be able to buy a token before presale starts", async () => {

  //     const saleID = await runningSale(0, user1, 100);

  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })
    
  //   it("should not be able to buy tokens without paying as per price of each token", async () => {

  //     const saleID = await runningSale(0, user1, 100);
  //     await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //     // const info = await presaleContract.presaleInfo(saleID);
  //     // console.log(String(info.priceOfEachToken));


  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "0"});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })

  //   it("should not be able to buy tokens less than minimum limit", async () => {

  //     const saleID = await runningSale(0, user1, 100);
  //     await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //     // const criteria = await presaleContract.presaleParticipationCriteria(saleID);
  //     // console.log(String(criteria.reqestedTokens.minTokensReq));


  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })

  //   it("should not be able to buy tokens more than maximum limit", async () => {

  //     const saleID = await runningSale(0, user1, 100);
  //     await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //     // const criteria = await presaleContract.presaleParticipationCriteria(saleID);
  //     // console.log(String(criteria.reqestedTokens.minTokensReq));


  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(saleID, 1100, {from: user2, value: "110000"});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })

  //   it("should be able to buy totokens in multiple steps but still can't exceed max limit", async () => {

  //     const saleID = await runningSale(0, user1, 100);
  //     await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

  //     // const criteria = await presaleContract.presaleParticipationCriteria(saleID);
  //     // console.log(String(criteria.reqestedTokens.minTokensReq));

  //     await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "500000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "300000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "200000"});            
      
  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "200000"});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })

  //   it("should not be able to buy tokens if they are sold out", async () => {

  //     const saleID = await runningSale2(0, owner, 0, 10000, 70);

  //     await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: owner});


  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user1, value: "200000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000"});
      

  //     const participant1 = await presaleContract.participant(saleID, user1);
  //     assert.equal(participant1.value, 200000);
  //     assert.equal(participant1.tokens, 2000);
  //     assert.equal(participant1.whiteListed, false);


  //     const participant2 = await presaleContract.participant(saleID, user2);
  //     assert.equal(participant2.value, 200000);
  //     assert.equal(participant2.tokens, 2000);
  //     assert.equal(participant2.whiteListed, false);

  //     const participant3 = await presaleContract.participant(saleID, user3);
  //     assert.equal(participant3.value, 200000);
  //     assert.equal(participant3.tokens, 2000);
  //     assert.equal(participant3.whiteListed, false);

  //     const participant4 = await presaleContract.participant(saleID, user4);
  //     assert.equal(participant4.value, 200000);
  //     assert.equal(participant4.tokens, 2000);
  //     assert.equal(participant4.whiteListed, false);

  //     const participant5 = await presaleContract.participant(saleID, user5);
  //     assert.equal(participant5.value, 200000);
  //     assert.equal(participant5.tokens, 2000);
  //     assert.equal(participant5.whiteListed, false);


  //     let err = false;
  //     try {
  //       await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user6, value: "200000"});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })

      describe("in an Open sale", () => {

    //     it("should be able to buy tokens by meeting all criterias", async () => {

    //       const saleID = await runningSale(0, user1, 100);
    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "500000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "300000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "200000"});
          
    //     })

    //     it("participant's contributions should reflect in the data properly", async () => {

    //       const saleID = await runningSale(0, user1, 100);
    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});

    //       const participant = await presaleContract.participant(saleID, user2);

    //       assert.equal(participant.value, 100000);
    //       assert.equal(participant.tokens, 1000);
    //       assert.equal(participant.whiteListed, false);
          
    //     })
      
      })

      describe("in an only whitelist sale", () => {

    //     it("should not be able to participate in sale if is not whitelisted", async () => {

    //       const saleID = await runningSale(1, user1, 100);

    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       let err = false;
    //       try {
    //         await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
    //       }
    //       catch(error){
    //         // console.log(error.reason)
    //         err = true;
    //       }
    //       assert.equal(err, true);
          
    //     })

    //     it("should be able to participate in sale if is whitelisted", async () => {

    //       // const runningSale = async (type, user, fee, criteriaToken, 250)

    //       const saleID = await runningSale(1, user1, 100);

    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       await presaleContract.whiteListUsersToBuyTokens(saleID, user2, {from: user1});
    //       await presaleContract.whiteListUsersToBuyTokens(saleID, user3, {from: user1});

    //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
          
    //     })

    //     it("participant's contributions should reflect in the data properly", async () => {

    //       const saleID = await runningSale(1, user1, 100);

    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       await presaleContract.whiteListUsersToBuyTokens(saleID, user2, {from: user1});
    //       await presaleContract.whiteListUsersToBuyTokens(saleID, user3, {from: user1});

    //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
          
    //       await presaleContract.buyTokensOnPresale(saleID, 800, {from: user3, value: "80000"});

    //       const participant2 = await presaleContract.participant(saleID, user2);
    //       const participant3 = await presaleContract.participant(saleID, user3);

    //       assert.equal(participant2.value, 80000);
    //       assert.equal(participant2.tokens, 800);
    //       assert.equal(participant2.whiteListed, true);

    //       assert.equal(participant3.value, 80000);
    //       assert.equal(participant3.tokens, 800);
    //       assert.equal(participant3.whiteListed, true);

          
    //     })
      
      })

      describe("in an only token holders sale", () => {

    //     it("should not be able to participate in sale if he don't have enough criteria tokens", async () => {

    //       const saleID = await runningSale(2, user1, 100, picnicTokenAddress, 250);

    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       let err = false;
    //       try {
    //         await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
    //       }
    //       catch(error){
    //         // console.log(error.reason)
    //         err = true;
    //       }
    //       assert.equal(err, true);
          
          
    //     })

    //     it("should be able participate in sale if he have enough criteria tokens", async () => {

    //       const saleID = await runningSale(2, user1, 100, picnicTokenAddress, 250);

    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       await picnicToken._mint(user2, 250, { from: user2 })
          
    //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});

    //     })

    //     it("participant's contributions should reflect in the data properly", async () => {

    //       const saleID = await runningSale(2, user1, 100, picnicTokenAddress, 250);

    //       await presaleContract.updatePresaleTime(saleID, now, now + 10000, {from: user1});

    //       await picnicToken._mint(user2, 250, { from: user2 })
    //       await picnicToken._mint(user3, 250, { from: user3 })
          
    //       await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000"});
    //       await presaleContract.buyTokensOnPresale(saleID, 300, {from: user2, value: "30000"});
          
    //       await presaleContract.buyTokensOnPresale(saleID, 800, {from: user3, value: "80000"});

    //       const participant2 = await presaleContract.participant(saleID, user2);
    //       const participant3 = await presaleContract.participant(saleID, user3);

    //       assert.equal(participant2.value, 80000);
    //       assert.equal(participant2.tokens, 800);
    //       assert.equal(participant2.whiteListed, false);

    //       assert.equal(participant3.value, 80000);
    //       assert.equal(participant3.tokens, 800);
    //       assert.equal(participant3.whiteListed, false);
          
    //     })
      
      })

    })
    
  })

  describe("Once presale ends", () => {
    
    describe("Contract", () => {

      // it("should considered sale as ended if expiry time has reached", async () => {
      //   const saleID = await runningSale2(0, user1, 100, 10000, 60 );

      //   // console.log("now =>", now)
      //   await presaleContract.updatePresaleTime(saleID, now, now + 35, {from: user1});

      //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user2, value: "100000"});
      //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
      //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "100000"});            
      //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user2, value: "100000"});
      //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "100000"});
      //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "100000"});            

      //   await delayFn(5000)

      //   let err = false;
      //   try {
      //     await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
      //   }
      //   catch(error){
      //     console.log(error.reason)
      //     err = true;
      //   }
      //   assert.equal(err, true);
      // })

      // it("should considered sale as ended if all tokens are sold out", async () => {

      //   const saleID = await runningSale2(0, user1, 100, 10000, 60 );

      //   // console.log("now =>", now)
      //   await presaleContract.updatePresaleTime(saleID, now, now + 30, {from: user1});

      //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
      //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
      //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
      //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000"});            
      //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user6, value: "200000"});           

      //   let err = false;
      //   try {
      //     await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
      //   }
      //   catch(error){
      //     console.log(error.reason)
      //     err = true;
      //   }
      //   assert.equal(err, true);

      // })

      // it("should not allow anyone else than owner to end the sale", async () => {
        
      //   const saleID = await soldOutSale();
  
      //   // const info = await presaleContract.presaleInfo(saleID);
      //   // console.log("preSaleStatus", String(info.preSaleStatus));
      //   // console.log("tokensForSale", String(info.tokensForSale));
      //   // console.log("remainingTokensForSale", String(info.remainingTokensForSale));
        
      //   let err = false;
      //   try {
      //     await presaleContract.endPresale(saleID, {from: user2});
      //   } catch(e){
      //     console.log(e.reason)
      //     err = true
      //   }
      //   assert.equal(err, true);
    
      // })

             
      // it("should reflect number of claims properly", async () => {
          
      //   const saleID = await soldOutSale();
      //   await presaleContract.endPresale(saleID, {from: user1});

      //   await presaleContract.claimTokensOrARefund(saleID, {from: user2});
      //   await presaleContract.claimTokensOrARefund(saleID, {from: user3});
      //   await presaleContract.claimTokensOrARefund(saleID, {from: user4});
      //   await presaleContract.claimTokensOrARefund(saleID, {from: user5});
      //   await presaleContract.claimTokensOrARefund(saleID, {from: user6});


      //   const counts2 = await presaleContract.presalectCounts(saleID);
      //   assert.equal(counts2.participantsCount, 5)
      //   assert.equal(counts2.claimsCount, 5)

      // })  

      describe("Should send proper tokens for liquidity to PanacakeRouter contract", () => {

        // it("Test 1", async () => {
        //   const saleID = await soldOutSale();
        //   const contractTokens1 = await erc20.balanceOf(presaleContractAddress)
        //   // console.log(String(contractTokens1))
          
        //   await presaleContract.endPresale(saleID, {from: user1});

        //   const internalData = await presaleContract.internalData(saleID);
        //   // const info = await presaleContract.presaleInfo(saleID);
        //   // console.log("tokensForSale ", Number(info.tokensForSale))
        //   // console.log("remainingTokensForSale", Number(info.remainingTokensForSale))
        //   // console.log("preSaleStatus", Number(info.preSaleStatus))
        //   // console.log(" ")
        //   // console.log("totalTokensSold ", String(internalData.totalTokensSold))
        //   // console.log("extraTokens ", String(internalData.extraTokens))
        //   // console.log("tokensAddedToLiquidity ", String(internalData.tokensAddedToLiquidity))
          
        //   // console.log("revenueFromPresale ", String(internalData.revenueFromPresale))
        //   const routerTokens = await erc20.balanceOf(routerAddress)
        //   assert.equal(Number(routerTokens), Number(internalData.tokensAddedToLiquidity))         
        //   // // console.log(String(contractTokens1_afterEnding))

        //   // const internalData = await presaleContract.internalData(saleID);
        //   // console.log("poolShareBNB ", String(internalData.poolShareBNB))
        //   // console.log("devTeamShareBNB ", String(internalData.devTeamShareBNB))
        //   // console.log("ownersShareBNB ", String(internalData.ownersShareBNB))

        // })

        // it("Test 2", async () => {

        //   routerContract = await Router.new();
        //   routerAddress = await routerContract.address;
        //   await presaleContract.setRouterAddr(routerAddress);
      
        //   await erc20._mint(user1, 17000, { from: user1 });
        //   await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
        //   await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 5000, now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
      
        //   const saleID = await presaleContract.count();
        //   assert.equal(saleID, 1);
      
        //   const info0 = await presaleContract.presaleInfo(saleID);
        //   assert.equal(info0.preSaleStatus, 0);
      
        //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
      
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000"});            
        //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user6, value: "100000"});            
        
        //   await delayFn(10000)
      
        //   await presaleContract.endPresale(saleID, {from: user1});

        //   const internalData = await presaleContract.internalData(saleID);
        //   const info = await presaleContract.presaleInfo(saleID);

        //   console.log("tokensForSale ", Number(info.tokensForSale))
        //   console.log("remainingTokensForSale", Number(info.remainingTokensForSale))
        //   console.log("preSaleStatus", Number(info.preSaleStatus))
        //   console.log(" ")
        //   console.log("totalTokensSold ", String(internalData.totalTokensSold))
        //   console.log("extraTokens ", String(internalData.extraTokens))
        //   console.log("tokensAddedToLiquidity ", String(internalData.tokensAddedToLiquidity))
          
        //   // console.log("revenueFromPresale ", String(internalData.revenueFromPresale))
        //   // const contractTokens1_afterEnding = await erc20.balanceOf(presaleContractAddress)
        //   // assert.equal(contractTokens1_afterEnding, contractTokens1 - internalData.tokensAddedToLiquidity)   
          
        //   // const tokensInRouterAddress = await erc20.balanceOf(routerAddress)
        //   // console.log("tokens In RouterAddress => ", Number(tokensInRouterAddress))
          
        //   // console.log("poolShareBNB ", String(internalData.poolShareBNB))
        //   // console.log("devTeamShareBNB ", String(internalData.devTeamShareBNB))
        //   // console.log("ownersShareBNB ", String(internalData.ownersShareBNB))

        // })


        // it("Test 3", async () => {
        
        //   routerContract = await Router.new();
        //   routerAddress = await routerContract.address;
        //   await presaleContract.setRouterAddr(routerAddress);
      
        //   await erc20._mint(user1, 17000, { from: user1 });
        //   await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
        //   await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 5000, now + 10000] ,[500, 2000], 5500, { from: user1, value: 100})      
      
        //   const saleID = await presaleContract.count();
        //   assert.equal(saleID, 1);
      
        //   const info0 = await presaleContract.presaleInfo(saleID);
        //   assert.equal(info0.preSaleStatus, 0);
      
        //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
      
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user3, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user4, value: "200000"});            
        //   await presaleContract.buyTokensOnPresale(saleID, 1000, {from: user5, value: "200000"});            
        //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user6, value: "100000"});            
        
        //   await delayFn(10000)
      
        //   await presaleContract.endPresale(saleID, {from: user1});

        //   const internalData = await presaleContract.internalData(saleID);
        //   const info = await presaleContract.presaleInfo(saleID);

        //   console.log("tokensForSale ", Number(info.tokensForSale))
        //   console.log("remainingTokensForSale", Number(info.remainingTokensForSale))
        //   console.log("preSaleStatus", Number(info.preSaleStatus))
        //   console.log(" ")
        //   console.log("totalTokensSold ", String(internalData.totalTokensSold))
        //   console.log("extraTokens ", String(internalData.extraTokens))
        //   console.log("tokensAddedToLiquidity ", String(internalData.tokensAddedToLiquidity))
          
        //   // console.log("revenueFromPresale ", String(internalData.revenueFromPresale))
        //   // const contractTokens1_afterEnding = await erc20.balanceOf(presaleContractAddress)
        //   // assert.equal(contractTokens1_afterEnding, contractTokens1 - internalData.tokensAddedToLiquidity)   
          
        //   // const tokensInRouterAddress = await erc20.balanceOf(routerAddress)
        //   // console.log("tokens In RouterAddress => ", Number(tokensInRouterAddress))
          
        //   // console.log("poolShareBNB ", String(internalData.poolShareBNB))
        //   // console.log("devTeamShareBNB ", String(internalData.devTeamShareBNB))
        //   // console.log("ownersShareBNB ", String(internalData.ownersShareBNB))

        // })

        // it("Test 4", async () => {

        //   routerContract = await Router.new();
        //   routerAddress = await routerContract.address;
        //   await presaleContract.setRouterAddr(routerAddress);
      
        //   await erc20._mint(user1, 23250, { from: user1 });
        //   await erc20.approve(presaleContractAddress, 23250, { from: user1 });
          
        //   await presaleContract.setPresale(0, erc20Address, erc20Address, 55, 15000, 100, 250, [now + 5000, now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
      
        //   const saleID = await presaleContract.count();
        //   assert.equal(saleID, 1);
      
        //   const info0 = await presaleContract.presaleInfo(saleID);
        //   assert.equal(info0.preSaleStatus, 0);
      
        //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
      
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000"});            
        
        //   await delayFn(10000)
      
        //   await presaleContract.endPresale(saleID, {from: user1});

        //   const internalData = await presaleContract.internalData(saleID);
        //   const info = await presaleContract.presaleInfo(saleID);

        //   console.log("tokensForSale ", Number(info.tokensForSale))
        //   console.log("remainingTokensForSale", Number(info.remainingTokensForSale))
        //   console.log("preSaleStatus", Number(info.preSaleStatus))
        //   console.log(" ")
        //   console.log("totalTokensSold ", String(internalData.totalTokensSold))
        //   console.log("extraTokens ", String(internalData.extraTokens))
        //   console.log("tokensAddedToLiquidity ", String(internalData.tokensAddedToLiquidity))
          
        //   // console.log("revenueFromPresale ", String(internalData.revenueFromPresale))
        //   // const contractTokens1_afterEnding = await erc20.balanceOf(presaleContractAddress)
        //   // assert.equal(contractTokens1_afterEnding, contractTokens1 - internalData.tokensAddedToLiquidity)   
          
        //   // const tokensInRouterAddress = await erc20.balanceOf(routerAddress)
        //   // console.log("tokens In RouterAddress => ", Number(tokensInRouterAddress))
          
        //   // console.log("poolShareBNB ", String(internalData.poolShareBNB))
        //   // console.log("devTeamShareBNB ", String(internalData.devTeamShareBNB))
        //   // console.log("ownersShareBNB ", String(internalData.ownersShareBNB))

        // })

        // it("Test 5", async () => {

        //   routerContract = await Router.new();
        //   routerAddress = await routerContract.address;
        //   await presaleContract.setRouterAddr(routerAddress);
      
        //   await erc20._mint(user1, 17000, { from: user1 });
        //   await erc20.approve(presaleContractAddress, 17000, { from: user1 });
          
        //   await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 5000, now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
      
        //   const saleID = await presaleContract.count();
        //   assert.equal(saleID, 1);
      
        //   const info0 = await presaleContract.presaleInfo(saleID);
        //   assert.equal(info0.preSaleStatus, 0);
      
        //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
      
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
        
        //   await delayFn(10000)
      
        //   await presaleContract.endPresale(saleID, {from: user1});

        //   const internalData = await presaleContract.internalData(saleID);
        //   const info = await presaleContract.presaleInfo(saleID);

        //   console.log("tokensForSale ", Number(info.tokensForSale))
        //   console.log("remainingTokensForSale", Number(info.remainingTokensForSale))
        //   console.log("preSaleStatus", Number(info.preSaleStatus))
        //   console.log(" ")
        //   console.log("totalTokensSold ", String(internalData.totalTokensSold))
        //   console.log("extraTokens ", String(internalData.extraTokens))
        //   console.log("tokensAddedToLiquidity ", String(internalData.tokensAddedToLiquidity))
        //   console.log("poolShareBNB ", String(internalData.poolShareBNB))
        //   console.log("devTeamShareBNB ", String(internalData.devTeamShareBNB))
        //   console.log("ownersShareBNB ", String(internalData.ownersShareBNB))
          
        //   // console.log("revenueFromPresale ", String(internalData.revenueFromPresale))
        //   // const contractTokens1_afterEnding = await erc20.balanceOf(presaleContractAddress)
        //   // assert.equal(contractTokens1_afterEnding, contractTokens1 - internalData.tokensAddedToLiquidity)   
          
        //   // const tokensInRouterAddress = await erc20.balanceOf(routerAddress)
        //   // console.log("tokens In RouterAddress => ", Number(tokensInRouterAddress))
          

        // })

        // it("Test 6", async () => {

        //   routerContract = await Router.new();
        //   routerAddress = await routerContract.address;
        //   await presaleContract.setRouterAddr(routerAddress);
      
        //   await erc20._mint(user1, 23250, { from: user1 });
        //   await erc20.approve(presaleContractAddress, 23250, { from: user1 });
          
        //   await presaleContract.setPresale(0, erc20Address, erc20Address, 55, 15000, 100, 250, [now + 5000, now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
      
        //   const saleID = await presaleContract.count();
        //   assert.equal(saleID, 1);
      
        //   const info0 = await presaleContract.presaleInfo(saleID);
        //   assert.equal(info0.preSaleStatus, 0);
      
        //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
      
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000"});
        //   await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000"});            
        
        //   await delayFn(10000)
      
        //   await presaleContract.endPresale(saleID, {from: user1});

        //   const internalData = await presaleContract.internalData(saleID);
        //   const info = await presaleContract.presaleInfo(saleID);

        //   console.log("tokensForSale ", Number(info.tokensForSale))
        //   console.log("remainingTokensForSale", Number(info.remainingTokensForSale))
        //   console.log("preSaleStatus", Number(info.preSaleStatus))
        //   console.log(" ")
        //   console.log("totalTokensSold ", String(internalData.totalTokensSold))
        //   console.log("extraTokens ", String(internalData.extraTokens))
        //   console.log("tokensAddedToLiquidity ", String(internalData.tokensAddedToLiquidity))
        //   console.log("poolShareBNB ", String(internalData.poolShareBNB))
        //   console.log("devTeamShareBNB ", String(internalData.devTeamShareBNB))
        //   console.log("ownersShareBNB ", String(internalData.ownersShareBNB))
          
        //   // console.log("revenueFromPresale ", String(internalData.revenueFromPresale))
        //   // const contractTokens1_afterEnding = await erc20.balanceOf(presaleContractAddress)
        //   // assert.equal(contractTokens1_afterEnding, contractTokens1 - internalData.tokensAddedToLiquidity)   
          
        //   // const tokensInRouterAddress = await erc20.balanceOf(routerAddress)
        //   // console.log("tokens In RouterAddress => ", Number(tokensInRouterAddress))
          

        // })

      })

    })

    describe("as an Owner", () => {

    //   it("should be able to end the sale if it is soldout", async () => {
        
    //     const saleID = await soldOutSale();

    //     // const info = await presaleContract.presaleInfo(saleID);
    //     // console.log("preSaleStatus", String(info.preSaleStatus));
    //     // console.log("tokensForSale", String(info.tokensForSale));
    //     // console.log("remainingTokensForSale", String(info.remainingTokensForSale));
        
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info1 = await presaleContract.presaleInfo(saleID);
    //     assert.equal(info1.preSaleStatus, 2);

    //     // console.log(String(info1.preSaleStatus));

    //   })

    //   it("should be able to end the sale if it is successful + expired", async () => {
        
    //     const saleID = await expiredSuccessfullSale();

    //     // const info = await presaleContract.presaleInfo(saleID);
    //     // console.log("preSaleStatus", String(info.preSaleStatus));
    //     // console.log("tokensForSale", String(info.tokensForSale));
    //     // console.log("remainingTokensForSale", String(info.remainingTokensForSale));
        
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info1 = await presaleContract.presaleInfo(saleID);
    //     assert.equal(info1.preSaleStatus, 2);

    //     // console.log(String(info1.preSaleStatus));

    //   })

    //   it("should be able to end the sale if it is unsuccessful + expired", async () => {
        
    //     const saleID = await expiredUnsuccessfullSale();

    //     // const info = await presaleContract.presaleInfo(saleID);
    //     // console.log("preSaleStatus", String(info.preSaleStatus));
    //     // console.log("tokensForSale", String(info.tokensForSale));
    //     // console.log("remainingTokensForSale", String(info.remainingTokensForSale));
        
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info1 = await presaleContract.presaleInfo(saleID);
    //     assert.equal(info1.preSaleStatus, 3);

    //     // console.log(String(info1.preSaleStatus));

    //   })

    //   it("should be able to see internal stats after a successfull sale", async () => {
        
    //     const saleID = await soldOutSale();        
    //     await presaleContract.endPresale(saleID, {from: user1});
        
    //     const info = await presaleContract.presaleInfo(saleID);
    //     assert.equal(info.preSaleStatus, 2);

    //     assert.equal(info.priceOfEachToken, 100);    
    //     assert.equal(info.tokensForSale, 10000);    
    //     assert.equal(info.remainingTokensForSale, 0);    
    //     assert.equal(info.accumulatedBalance, 1000000);      

    //     const internalData = await presaleContract.internalData(saleID);
    //     assert.equal(internalData.totalTokensSold, 10000 );    
    //     assert.equal(internalData.revenueFromPresale, 1000000);
    //     assert.equal(internalData.tokensAddedToLiquidity, 7000);    
    //     assert.equal(internalData.poolShareBNB, 700000);
    //     assert.equal(internalData.devTeamShareBNB, 20000);
    //     assert.equal(internalData.ownersShareBNB, 280000 );    

    //   })


    //   it("should not be able to see internal stats after a failed sale", async () => {
        
    //     const saleID = await expiredUnsuccessfullSale();        
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info = await presaleContract.presaleInfo(saleID);
    //     assert.equal(info.preSaleStatus, 3);

    //     assert.equal(info.priceOfEachToken, 100);    
    //     assert.equal(info.tokensForSale, 10000);    
    //     assert.equal(info.remainingTokensForSale, 5000);
    //     assert.equal(info.accumulatedBalance, 500000);      


    //     const internalData = await presaleContract.internalData(saleID);
    //     assert.equal(internalData.totalTokensSold, 0 );    
    //     assert.equal(internalData.revenueFromPresale, 0);
    //     assert.equal(internalData.tokensAddedToLiquidity, 0);    
    //     assert.equal(internalData.poolShareBNB, 0);
    //     assert.equal(internalData.devTeamShareBNB, 0);
    //     assert.equal(internalData.ownersShareBNB, 0 );    
  

    //   })

    })

    describe("as a participant", () => {

    //   it("should not be able to participate once the sale has been ended by owner after success + soldout", async () => {
        
    //     const saleID = await soldOutSale();        
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info = await presaleContract.presaleInfo(saleID);
    //     // console.log(info.remainingTokensForSale)
    //     assert.notEqual(info.preSaleStatus, 1);

    //     let err = false;
    //     try {
    //       await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
    //     }
    //     catch(error){
    //       // console.log(error.reason)
    //       err = true;
    //     }
    //     assert.equal(err, true);

    //   })

    //   it("should not be able to participate once the sale has been ended by owner after success + expiry", async () => {
        
    //     const saleID = await expiredSuccessfullSale();
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info = await presaleContract.presaleInfo(saleID);
    //     assert.notEqual(info.preSaleStatus, 1);


    //     let err = false;
    //     try {
    //       await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
    //     }
    //     catch(error){
    //       // console.log(error.reason)
    //       err = true;
    //     }
    //     assert.equal(err, true);

    //   })

    //   it("should not be able to participate once the sale has been ended by owner after failed + expiry", async () => {
        
    //     const saleID = await expiredUnsuccessfullSale();
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info = await presaleContract.presaleInfo(saleID);
    //     assert.notEqual(info.preSaleStatus, 1);


    //     let err = false;
    //     try {
    //       await presaleContract.buyTokensOnPresale(saleID, 200, {from: user2, value: "20000"});
    //     }
    //     catch(error){
    //       // console.log(error.reason)
    //       err = true;
    //     }
    //     assert.equal(err, true);

    //   })

    //   it("Should be able to see his contributions properly", async () => {
        
    //     const saleID = await expiredSuccessfullSale();
    //     await presaleContract.endPresale(saleID, {from: user1});

    //     const info = await presaleContract.presaleInfo(saleID);
    //     assert.equal(info.preSaleStatus, 2);

    //     const participant2 = await presaleContract.participant(saleID, user2);
    //     assert.equal(participant2.value, 200000);
    //     assert.equal(participant2.tokens, 2000);
    //     assert.equal(participant2.whiteListed, false);

    //     const participant3 = await presaleContract.participant(saleID, user3);
    //     assert.equal(participant3.value, 200000);
    //     assert.equal(participant3.tokens, 2000);
    //     assert.equal(participant3.whiteListed, false);

    //     const participant4 = await presaleContract.participant(saleID, user4);
    //     assert.equal(participant4.value, 200000);
    //     assert.equal(participant4.tokens, 2000);
    //     assert.equal(participant4.whiteListed, false);

    //     const participant5 = await presaleContract.participant(saleID, user5);
    //     assert.equal(participant5.value, 200000);
    //     assert.equal(participant5.tokens, 2000);
    //     assert.equal(participant5.whiteListed, false);

    //     const participant6 = await presaleContract.participant(saleID, user5);
    //     assert.equal(participant6.value, 200000);
    //     assert.equal(participant6.tokens, 2000);
    //     assert.equal(participant6.whiteListed, false);


    //   })

    
      describe("before claiming", () => {

    //     it("should not own any presale tokens", async () => {
          
    //       const saleID = await expiredSuccessfullSale();
    //       await presaleContract.endPresale(saleID, {from: user1});

    //       const info = await presaleContract.presaleInfo(saleID);
    //       assert.equal(info.preSaleStatus, 2);

    //       const contractER20 = await erc20.balanceOf(presaleContractAddress)
    //       assert.equal(contractER20, 10700);

    //       const contractuser2 = await erc20.balanceOf(user2)
    //       assert.equal(contractuser2, 0)

    //       const contractuser3 = await erc20.balanceOf(user3)
    //       assert.equal(contractuser3, 0)

    //       const contractuser4 = await erc20.balanceOf(user4)
    //       assert.equal(contractuser4, 0)

    //       const contractuser5 = await erc20.balanceOf(user5)
    //       assert.equal(contractuser5 , 0)

    //       const contractuser6 = await erc20.balanceOf(user6)
    //       assert.equal(contractuser6, 0)

    //     })    

      })

    })   
    
  })

  describe("On successfull sale", () => {

  //   it("everyone should recieve his shares as expected", async () => { 
      
  //     const costOfGasUnit =  20000000000;
      
      
  //     routerContract = await Router.new();
  //     routerAddress = await routerContract.address;
      
  //     await presaleContract.setRouterAddr(routerAddress);
      
  //     await erc20._mint(user1, 17000);
  //     const transaction1 = await erc20.approve(presaleContractAddress, 17000, { from: user1 });
  //     const gas1 = costOfGasUnit * transaction1.receipt.gasUsed;
      
  //     const transaction2 = await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 100000000, 250, [now + 5000, now + 10000] ,[500, 2000], 7500, { from: user1, value: 100})      
  //     const gas2 = costOfGasUnit * transaction2.receipt.gasUsed;
      
  //     const saleID = await presaleContract.count();
      
  //     const transaction3 = await presaleContract.updatePresaleTime(saleID, now, now + 35, {from: user1});
  //     const gas3 = costOfGasUnit * transaction3.receipt.gasUsed;
      
      
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user2, value: "200000000000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user3, value: "200000000000"});
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user4, value: "200000000000"});            
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user5, value: "200000000000"});            
  //     await presaleContract.buyTokensOnPresale(saleID, 2000, {from: user6, value: "200000000000"});            
      
      
  //     const dev_balance_before_sale = Number(await web3.eth.getBalance(dev));
      
  //     const devTeam_balance_before_sale = Number(await web3.eth.getBalance(devTeam));
      
  //     const owner_balance_before_sale = Number(await web3.eth.getBalance(user1));
      
      
  //     const transaction4 = await presaleContract.endPresale(saleID, {from: user1});
  //     const gas = costOfGasUnit * Number(transaction4.receipt.gasUsed) ;
  //     console.log("gas", Number(gas))
      
  //     const info2 = await presaleContract.presaleInfo(saleID);
  //     assert.equal(info2.preSaleStatus, 2);
      
      
      
  //     const internalData = await presaleContract.internalData(saleID);
  //     console.log(" ")
  //     console.log("ownersShareBNB", Number(internalData.ownersShareBNB))
  //     console.log("devShareBNB", Number(internalData.devTeamShareBNB)*0.75)
  //     console.log("devTeamShareBNB", Number(internalData.devTeamShareBNB)*0.25)
  //     console.log(" ")
      
  //     const owner_balance_after_sale = Number(await web3.eth.getBalance(user1));
  //     const devTeam_balance_after_sale = Number(await web3.eth.getBalance(devTeam));
  //     const dev_balance_after_sale = Number(await web3.eth.getBalance(dev));

      
  //     console.log("owner_balance_before_sale", Number(owner_balance_before_sale))
  //     console.log("owner_balance_after_sale", Number(owner_balance_after_sale))
  //     console.log("dev_balance_before_sale", Number(dev_balance_before_sale))
  //     console.log("dev_balance_after_sale", Number(dev_balance_after_sale))
  //     console.log("devTeam_balance_before_sale", Number(devTeam_balance_before_sale))
  //     console.log("devTeam_balance_after_sale", Number(devTeam_balance_after_sale))

      
  //     console.log(" ")

  //     console.log("owner recieves proper share difference =>", owner_balance_after_sale - ( owner_balance_before_sale + Number(internalData.ownersShareBNB) - gas ))

  //     console.log("owner recieves proper share =>", owner_balance_after_sale === ( owner_balance_before_sale + Number(internalData.ownersShareBNB) - gas ))
  //     console.log("dev recieves proper share =>", dev_balance_after_sale === ( dev_balance_before_sale + Number(internalData.devTeamShareBNB) * 75/100 ) )
  //     console.log("devTeam recieves proper share =>", devTeam_balance_after_sale === ( devTeam_balance_before_sale + Number(internalData.devTeamShareBNB)*25/100 ))
      
  //     assert.equal(owner_balance_after_sale, owner_balance_before_sale + Number(internalData.ownersShareBNB) - gas );
  //     assert.equal(dev_balance_after_sale, dev_balance_before_sale + Number(internalData.devTeamShareBNB) * 75/100 );
  //     assert.equal(devTeam_balance_after_sale, devTeam_balance_before_sale + Number(internalData.devTeamShareBNB) * 25/100 );
     


  //   })


  //   it("participant with no contributions cannot claim any funds", async () => {
      
  //     const saleID = await soldOutSale();
  //     await presaleContract.endPresale(saleID, {from: user1});

  //     const info = await presaleContract.presaleInfo(saleID);
  //     assert.equal(info.preSaleStatus, 2);

  //     const participant7 = await presaleContract.participant(saleID, user7);
  //     assert.equal(participant7.value, 0);

  //     let err = false;
  //     try {
  //       await presaleContract.claimTokensOrARefund(saleID, {from: user7});
  //     }
  //     catch(error){
  //       console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })


  //   it("participant with contributions can claim their tokens", async () => {
      
  //     const saleID = await soldOutSale();
  //     await presaleContract.endPresale(saleID, {from: user1});

  //     const info = await presaleContract.presaleInfo(saleID);
  //     assert.equal(info.preSaleStatus, 2);


  //     const contractTokens = await erc20.balanceOf(presaleContractAddress)
  //     assert.equal(contractTokens, 10000)


  //     const contractuser2 = await erc20.balanceOf(user2)
  //     assert.equal(contractuser2, 0)

  //     const participant2 = await presaleContract.participant(saleID, user2);
  //     assert.equal(participant2.tokens, 2000);

  //     await presaleContract.claimTokensOrARefund(saleID, {from: user2});

  //     const contractuser2_afterClaim = await erc20.balanceOf(user2)
  //     assert.equal(contractuser2_afterClaim, 2000)

  //     const participant2_afterClaim = await presaleContract.participant(saleID, user2);
  //     assert.equal(participant2_afterClaim.tokens, 0);


  //     const participant3 = await presaleContract.participant(saleID, user3);
  //     assert.equal(participant3.tokens, 2000);

  //     await presaleContract.claimTokensOrARefund(saleID, {from: user3});

  //     const contractuser3_afterClaim = await erc20.balanceOf(user3)
  //     assert.equal(contractuser2_afterClaim, 2000)

  //     const participant3_afterClaim = await presaleContract.participant(saleID, user3);
  //     assert.equal(participant3_afterClaim.tokens, 0);


  //     const contractTokens_afterClaim = await erc20.balanceOf(presaleContractAddress)
  //     assert.equal(contractTokens_afterClaim, 6000)

  //   })  


  //   it("participant with contributions cannot claim their tokens twice", async () => {
      
  //     const saleID = await soldOutSale();
  //     await presaleContract.endPresale(saleID, {from: user1});

  //     const info = await presaleContract.presaleInfo(saleID);
  //     assert.equal(info.preSaleStatus, 2);

  //     const participant2 = await presaleContract.participant(saleID, user2);
  //     assert.equal(participant2.tokens, 2000);

  //     await presaleContract.claimTokensOrARefund(saleID, {from: user2});

  //     const contractuser2_afterClaim = await erc20.balanceOf(user2)
  //     assert.equal(contractuser2_afterClaim, 2000)

  //     const participant2_afterClaim = await presaleContract.participant(saleID, user2);
  //     assert.equal(participant2_afterClaim.tokens, 0);


  //     let err = false;
  //     try {
  //       await presaleContract.claimTokensOrARefund(saleID, {from: user2});
  //     }
  //     catch(error){
  //       // console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })  


  //   it("after ending the sale, only owner can withdraw remaining tokens ", async () => {
      
  //     const saleID = await expiredSuccessfullSale();

  //     let err = false;
  //     try {
  //       await presaleContract.burnOrWithdrawTokens(saleID, 1, {from: user1});
  //     }
  //     catch(error){
  //       console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //     await presaleContract.endPresale(saleID, {from: user1});

  //     const info = await presaleContract.presaleInfo(saleID);
  //     // console.log("status ", Number(info.preSaleStatus));

  //     const balanceBefore = await erc20.balanceOf(user1);
  //     // console.log("balanceBefore", Number(balanceBefore))

  //     const internalData = await presaleContract.internalData(saleID);
  //     // console.log(" ")
  //     // console.log("extraTokens", Number(internalData.extraTokens))
  //     // console.log(" ")

  //     err = false;
  //     try {
  //       await presaleContract.burnOrWithdrawTokens(saleID, 1, {from: user2});
  //     }
  //     catch(error){
  //       console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //     await presaleContract.burnOrWithdrawTokens(saleID, 1, {from: user1});

  //     const internalData1 = await presaleContract.internalData(saleID);
  //     // console.log(" ")
  //     // console.log("extraTokens", Number(internalData1.extraTokens))

  //     const balanceAfter = await erc20.balanceOf(user1); 
  //     // console.log("balanceAfter", Number(balanceAfter))

  //   })  


  //   it("after ending the sale, only owner can burn the remaining tokens ", async () => {
      
  //     const saleID = await expiredSuccessfullSale();

  //     await presaleContract.endPresale(saleID, {from: user1});

  //     const info = await presaleContract.presaleInfo(saleID);
  //     // console.log("status ", Number(info.preSaleStatus));

  //     const balanceBefore = await erc20.balanceOf(user1);
  //     assert.equal(Number(balanceBefore), 0);

  //     const internalData = await presaleContract.internalData(saleID);
  //     // console.log(" ")
  //     // console.log("extraTokens", Number(internalData.extraTokens))
  //     // console.log(" ")


  //     await presaleContract.burnOrWithdrawTokens(saleID, 0, {from: user1});

  //     const internalData1 = await presaleContract.internalData(saleID);
  //     // console.log(" ")
  //     // console.log("extraTokens", Number(internalData1.extraTokens))

  //     const balanceAfter = await erc20.balanceOf(user1); 
  //     assert.equal(Number(balanceAfter), 0);

  //     let err = false;
  //     try {
  //       await presaleContract.burnOrWithdrawTokens(saleID, 2, {from: user1});
  //     }
  //     catch(error){
  //       console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);

  //   })  


  //   it("after ending the sale, owner cannot withdraw remaining tokens twice ", async () => {
      
  //     const saleID = await expiredSuccessfullSale();

  //     await presaleContract.endPresale(saleID, {from: user1});

  //     const info = await presaleContract.presaleInfo(saleID);
  //     // console.log("status ", Number(info.preSaleStatus));

  //     const balanceBefore = await erc20.balanceOf(user1);
  //     assert.equal(Number(balanceBefore), 0)

  //     const internalData = await presaleContract.internalData(saleID);
  //     // console.log(" ")
  //     // console.log("extraTokens", Number(internalData.extraTokens))
  //     // console.log(" ")

  //     await presaleContract.burnOrWithdrawTokens(saleID, 1, {from: user1});

  //     const internalData1 = await presaleContract.internalData(saleID);
  //     // console.log(" ")
  //     // console.log("extraTokens", Number(internalData1.extraTokens))

  //     const balanceAfter = await erc20.balanceOf(user1); 
  //     assert.equal(Number(balanceAfter), internalData.extraTokens)

  //     let err = false;
  //     try {
  //       await presaleContract.burnOrWithdrawTokens(saleID, 1, {from: user1});
  //     }
  //     catch(error){
  //       console.log(error.reason)
  //       err = true;
  //     }
  //     assert.equal(err, true);




  //   })  


  })

  describe("On unsuccessfull sale", () => {

    // it("no one should recieve any share", async () => { 
      
    //   const costOfGasUnit =  20000000000;
           
    //   const saleID = await expiredUnsuccessfullSale();    
      
    //   const transaction4 = await presaleContract.endPresale(saleID, {from: user1});
    //   const gas = costOfGasUnit * Number(transaction4.receipt.gasUsed) ;
    //   // console.log("gas", Number(gas))
      
    //   const info2 = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info2.preSaleStatus, 3);
      
    //   const internalData = await presaleContract.internalData(saleID);
    //   assert.equal(internalData.ownersShareBNB, 0)
    //   assert.equal(internalData.devTeamShareBNB, 0)
      
    // })
    
    // it("participant with no contributions cannot claim any funds", async () => {
      
    //   const saleID = await expiredUnsuccessfullSale();
    //   await presaleContract.endPresale(saleID, {from: user1});

    //   const info = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info.preSaleStatus, 3);

    //   const participant7 = await presaleContract.participant(saleID, user7);
    //   assert.equal(participant7.value, 0);


    //   let err = false;
    //   try {
    //     await presaleContract.claimTokensOrARefund(saleID, {from: user7});
    //   }
    //   catch(error){
    //     // console.log(error.reason)
    //     err = true;
    //   }
    //   assert.equal(err, true);

    // })

    // it("participant with contributions can claim their refunds", async () => {
      
    //   routerContract = await Router.new();
    //   routerAddress = await routerContract.address;
    //   await presaleContract.setRouterAddr(routerAddress);
  
    //   await erc20._mint(user1, 17000, { from: user1 });
    //   await erc20.approve(presaleContractAddress, 17000, { from: user1 });
      
    //   await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1000000, 250, [now + 5000, now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
  
    //   const saleID = await presaleContract.count();
    //   assert.equal(saleID, 1);
  
    //   const info = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info.preSaleStatus, 0);
  
    //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
  
    //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000000000"});
    //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "50000000000"});
    //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "50000000000"});            
    
    //   await delayFn(12000)
      
    //   await presaleContract.endPresale(saleID, {from: user1});

    //   const info2 = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info2.preSaleStatus, 3);



    //   const participant2 = await presaleContract.participant(saleID, user2);
    //   // console.log("participant2 tokens ", Number(participant2.tokens))
    //   // console.log("participant2 value ", Number(participant2.value))

    //   const participant3 = await presaleContract.participant(saleID, user3);
    //   // console.log("participant3 tokens ", Number(participant3.tokens))
    //   // console.log("participant3 value ", Number(participant3.value))

    //   const participant4 = await presaleContract.participant(saleID, user4);
    //   // console.log("participant4 tokens ", Number(participant4.tokens))
    //   // console.log("participant4 value ", Number(participant4.value))


    //   const costOfGasUnit =  20000000000;


    //   const balance2_before_claim = Number(await web3.eth.getBalance(user2));
    //   const claimTransection2 = await presaleContract.claimTokensOrARefund(saleID, {from: user2});
    //   const totalGasCost2 = costOfGasUnit * claimTransection2.receipt.gasUsed;
    //   const balance2_after_claim = Number(await web3.eth.getBalance(user2));
    //   assert.equal(balance2_after_claim , Number(participant2.value) +  balance2_before_claim - totalGasCost2)          
      
      

    //   const balance3_before_claim = Number(await web3.eth.getBalance(user3));
    //   const claimTransection3 = await presaleContract.claimTokensOrARefund(saleID, {from: user3});
    //   const totalGasCost3 = costOfGasUnit * claimTransection3.receipt.gasUsed;
    //   const balance3_after_claim = Number(await web3.eth.getBalance(user3));
    //   assert.equal(balance3_after_claim, Number(participant3.value) +  balance3_before_claim - totalGasCost3)          
     


    //   const balance4_before_claim = Number(await web3.eth.getBalance(user4));
    //   const claimTransection4 = await presaleContract.claimTokensOrARefund(saleID, {from: user4});
    //   const totalGasCost4 = costOfGasUnit * claimTransection4.receipt.gasUsed;
    //   const balance4_after_claim = Number(await web3.eth.getBalance(user4));
    //   assert.equal(balance4_after_claim, Number(participant4.value) +  balance4_before_claim - totalGasCost4)          




    //   // const participant2_2 = await presaleContract.participant(saleID, user2);
    //   // console.log("participant2 tokens ", Number(participant2_2.tokens))
    //   // console.log("participant2 value ", Number(participant2_2.value))

    //   // const participant3_2 = await presaleContract.participant(saleID, user3);
    //   // console.log("participant3 tokens ", Number(participant3_2.tokens))
    //   // console.log("participant3 value ", Number(participant3_2.value))

    //   // const participant4_2 = await presaleContract.participant(saleID, user4);
    //   // console.log("participant4 tokens ", Number(participant4_2.tokens))
    //   // console.log("participant4 value ", Number(participant4_2.value))


    // })  


    // it("participant with contributions cannot claim their refund twice", async () => {
      
    //   routerContract = await Router.new();
    //   routerAddress = await routerContract.address;
    //   await presaleContract.setRouterAddr(routerAddress);
  
    //   await erc20._mint(user1, 17000, { from: user1 });
    //   await erc20.approve(presaleContractAddress, 17000, { from: user1 });
      
    //   await presaleContract.setPresale(0, erc20Address, erc20Address, 70, 10000, 1000000, 250, [now + 5000, now + 10000] ,[500, 2000], 8000, { from: user1, value: 100})      
  
    //   const saleID = await presaleContract.count();
    //   assert.equal(saleID, 1);
  
    //   const info = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info.preSaleStatus, 0);
  
    //   await presaleContract.updatePresaleTime(saleID, now, now + 20, {from: user1});
  
    //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user2, value: "50000000000"});
    //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user3, value: "50000000000"});
    //   await presaleContract.buyTokensOnPresale(saleID, 500, {from: user4, value: "50000000000"});            
    
    //   await delayFn(12000)
      
    //   await presaleContract.endPresale(saleID, {from: user1});

    //   const info2 = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info2.preSaleStatus, 3);

    //   const participant2 = await presaleContract.participant(saleID, user2);
    //   // console.log("participant2 tokens ", Number(participant2.tokens))
    //   // console.log("participant2 value ", Number(participant2.value))

    //   const participant3 = await presaleContract.participant(saleID, user3);
    //   // console.log("participant3 tokens ", Number(participant3.tokens))
    //   // console.log("participant3 value ", Number(participant3.value))

    //   const participant4 = await presaleContract.participant(saleID, user4);
    //   // console.log("participant4 tokens ", Number(participant4.tokens))
    //   // console.log("participant4 value ", Number(participant4.value))

    //   const costOfGasUnit =  20000000000;

    //   const balance2_before_claim = Number(await web3.eth.getBalance(user2));
    //   const claimTransection2 = await presaleContract.claimTokensOrARefund(saleID, {from: user2});
    //   const totalGasCost2 = costOfGasUnit * claimTransection2.receipt.gasUsed;
    //   const balance2_after_claim = Number(await web3.eth.getBalance(user2));
    //   assert.equal(balance2_after_claim , Number(participant2.value) +  balance2_before_claim - totalGasCost2)          
      
 
    //   // const participant2_2 = await presaleContract.participant(saleID, user2);
    //   // console.log("participant2 tokens ", Number(participant2_2.tokens))
    //   // console.log("participant2 value ", Number(participant2_2.value))

    //   // const participant3_2 = await presaleContract.participant(saleID, user3);
    //   // console.log("participant3 tokens ", Number(participant3_2.tokens))
    //   // console.log("participant3 value ", Number(participant3_2.value))

    //   // const participant4_2 = await presaleContract.participant(saleID, user4);
    //   // console.log("participant4 tokens ", Number(participant4_2.tokens))
    //   // console.log("participant4 value ", Number(participant4_2.value))

    //   let err = false;
    //   try {
    //     await presaleContract.claimTokensOrARefund(saleID, {from: user2});
    //   }
    //   catch(error){
    //     // console.log(error.reason)
    //     err = true;
    //   }
    //   assert.equal(err, true);

    // })  


    // it("after ending the sale, only owner can withdraw all the tokens ", async () => {
      
    //   const saleID = await expiredUnsuccessfullSale();

    //   await presaleContract.endPresale(saleID, {from: user1});

    //   const info = await presaleContract.presaleInfo(saleID);
    //   assert.equal(info.preSaleStatus, 3);

    //   const balanceBefore = await erc20.balanceOf(user1);
    //   // console.log("balanceBefore", Number(balanceBefore))

    //   const internalData = await presaleContract.internalData(saleID);
    //   // console.log(" ")
    //   // console.log("extraTokens", Number(internalData.extraTokens))
    //   // console.log(" ")

    //   await presaleContract.burnOrWithdrawTokens(saleID, 1, {from: user1});

    //   // const internalData1 = await presaleContract.internalData(saleID);
    //   // console.log(" ")
    //   // console.log("extraTokens", Number(internalData1.extraTokens))

    //   const balanceAfter = await erc20.balanceOf(user1); 
    //   assert.equal(Number(balanceAfter), Number(internalData.extraTokens))

    // })  

  })

})