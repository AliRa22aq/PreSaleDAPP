// const { default: Web3 } = require("web3");

var PICNICLocker = artifacts.require("PICNICLocker.sol");
var TestCoin = artifacts.require("TestCoin.sol");
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  balance,
  time

} = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract("PICNICLocker", (accounts) => {
  
  let locker;
  let testCoin;

  let lockerAddress;
  let testCoinAddress;

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

  const mintTokens = async (user) => {
    await testCoin._mint(user, 20000000000000, { from: user });
    await testCoin.approve(lockerAddress, 20000000000000, { from: user });
    const userBalance = await testCoin.balanceOf(user);
    return userBalance;
  }

  beforeEach(async () => {
    locker = await PICNICLocker.new();
    lockerAddress = await locker.address;

    testCoin = await TestCoin.new();
    testCoinAddress = await testCoin.address;

  });

  describe("Deployment =>", () => {

      it("deploys successfully", async () => {
   
        assert.notEqual(lockerAddress, 0x0);
        assert.notEqual(lockerAddress, "");
         
        assert.notEqual(testCoinAddress, 0x0);
        assert.notEqual(testCoinAddress, "");
          
      });
              
  });

  describe("Owner =>", () => {

    it("can update the fees", async () => {
 
      let lockFee;
      let updateLokcerFee;

      lockFee = await locker.lockFee();
      assert.equal(String(lockFee), web3.utils.toWei('0.1', 'ether'));

      updateLokcerFee = await locker.updateLokcerFee();
      assert.equal(String(updateLokcerFee), web3.utils.toWei('0.05', 'ether'));
        
      await locker.updateFees(web3.utils.toWei('0.2', 'ether'), web3.utils.toWei('0.1', 'ether'));

      lockFee = await locker.lockFee();
      assert.equal(String(lockFee), web3.utils.toWei('0.2', 'ether'));

      updateLokcerFee = await locker.updateLokcerFee();
      assert.equal(String(updateLokcerFee), web3.utils.toWei('0.1', 'ether'));


    });
    
    it("can withdraw all the funds", async () => {
 
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));
      let contractBalance;
      let ownerBalance;


      let testCoin1 = await TestCoin.new();
      testCoinAddress1 = await testCoin1.address;

      await testCoin1._mint(user1, 5000000000000, { from: user1 });
      await testCoin1.approve(lockerAddress, 5000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress1, 5000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


      let testCoin2 = await TestCoin.new();
      testCoinAddress2 = await testCoin2.address;

      await testCoin2._mint(user1, 20000000000000, { from: user1 });
      await testCoin2.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      let testCoin3 = await TestCoin.new();
      testCoinAddress3 = await testCoin3.address;

      await testCoin3._mint(user1, 10000000000000, { from: user1 });
      await testCoin3.approve(lockerAddress, 10000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress3, 10000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
  
      const contractBalance1 =  await testCoin1.balanceOf(lockerAddress);
      const contractBalance2 =  await testCoin2.balanceOf(lockerAddress);
      const contractBalance3 =  await testCoin3.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance1), 5000000000000 );
      assert.equal(Number(contractBalance2), 20000000000000 );
      assert.equal(Number(contractBalance3), 10000000000000 );


      // contractBalance = await balance.current(lockerAddress)
      // console.log(String(contractBalance));
      
      // ownerBalance = await balance.current(owner)
      // console.log("old", Number(ownerBalance));

      const tracker = await balance.tracker(owner);


      contractBalance = await web3.eth.getBalance(lockerAddress);
      assert.equal(web3.utils.fromWei(contractBalance, 'ether'), "0.3");


      let err = false;
      try{
          await locker.withdrawFunds({from: user2});
      }
      catch(e){
        // console.log(e.reason);
        err = true;
      }
      assert.equal(err, true);

      await locker.withdrawFunds({from: owner});

      contractBalance = await web3.eth.getBalance(lockerAddress);
      assert.equal(web3.utils.fromWei(contractBalance, 'ether'), "0");

      let { delta, fees } = await tracker.deltaWithFees();
      const earning = String(Number(delta) + Number(fees))
      assert.equal(web3.utils.fromWei(earning, 'ether'), "0.3");

      // const ownerNewBalance = await balance.current(owner)
      // console.log("New", Number(ownerNewBalance));


    });
  });

  describe("Contract =>", () => {

    it("will hold all the tokens locked init", async () => {
 
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      let testCoin1 = await TestCoin.new();
      testCoinAddress1 = await testCoin1.address;

      await testCoin1._mint(user1, 5000000000000, { from: user1 });
      await testCoin1.approve(lockerAddress, 5000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress1, 5000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


      let testCoin2 = await TestCoin.new();
      testCoinAddress2 = await testCoin2.address;

      await testCoin2._mint(user1, 20000000000000, { from: user1 });
      await testCoin2.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      let testCoin3 = await TestCoin.new();
      testCoinAddress3 = await testCoin3.address;

      await testCoin3._mint(user1, 10000000000000, { from: user1 });
      await testCoin3.approve(lockerAddress, 10000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress3, 10000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
  
      const contractBalance1 =  await testCoin1.balanceOf(lockerAddress);
      const contractBalance2 =  await testCoin2.balanceOf(lockerAddress);
      const contractBalance3 =  await testCoin3.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance1), 5000000000000 );
      assert.equal(Number(contractBalance2), 20000000000000 );
      assert.equal(Number(contractBalance3), 10000000000000 );
    

    });

    it("will hold all the fees from all locker creation and update", async () => {
 
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      let testCoin1 = await TestCoin.new();
      testCoinAddress1 = await testCoin1.address;

      await testCoin1._mint(user1, 10000000000000, { from: user1 });
      await testCoin1.approve(lockerAddress, 10000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress1, 5000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


      let testCoin2 = await TestCoin.new();
      testCoinAddress2 = await testCoin2.address;

      await testCoin2._mint(user1, 40000000000000, { from: user1 });
      await testCoin2.approve(lockerAddress, 40000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      let testCoin3 = await TestCoin.new();
      testCoinAddress3 = await testCoin3.address;

      await testCoin3._mint(user1, 20000000000000, { from: user1 });
      await testCoin3.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress3, 10000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
  
      await locker.addTokenstoALocker(1, 5000000000000, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 
      await locker.addTokenstoALocker(2, 20000000000000, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 
      await locker.addTokenstoALocker(3, 10000000000000, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 

      const contractBalance = await web3.eth.getBalance(lockerAddress);
      assert.equal(web3.utils.fromWei(contractBalance, 'ether'), "0.45");
    

    });
            
  });


  describe("Locking =>", () => {

    it("User can lock tokens", async () => {
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
    
    });
      
    it("after locking, anyone can see his locked token info", async () => {

      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      
      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      const locksListbyUser =  await locker.getLockersListbyUser(user1);
      assert.equal(Number(locksListbyUser), 1);

  
      const locksListbyToken =  await locker.getLockersListbyToken(testCoinAddress, {from: user1});
      assert.equal(Number(locksListbyToken), 1);

      const contractBalance = await testCoin.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance), 20000000000000);
  
      const lock1details =  await locker.loker(1);
      assert.equal(Number(lock1details.id), 1);
      assert.equal(String(lock1details.owner), user1);
      assert.equal(String(lock1details.tokenAddress), testCoinAddress);
      assert.equal(Number(lock1details.numOfTokens), 20000000000000);
      assert.equal(Number(lock1details.unlockTime) , latestTime + OneYearsduration);
      assert.equal(Number(lock1details.status), 0);


    })

    it("after locking, user can add more tokens to the lock by paying update fee", async () => {
               
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      let contractBalance;
      let lock1details;

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      contractBalance = await testCoin.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance), 20000000000000);
  
      lock1details =  await locker.loker(1);
      assert.equal(Number(lock1details.numOfTokens), 20000000000000);

      await testCoin._mint(user1, 10000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 10000000000000, { from: user1 });
      await locker.addTokenstoALocker(1, 10000000000000, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 
      
      contractBalance = await testCoin.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance), 30000000000000);
  
      lock1details =  await locker.loker(1);
      assert.equal(Number(lock1details.numOfTokens), 30000000000000);

    })

    it("after locking, user can increase the locking period by paying update fee", async () => {
      
      let lock1details;

      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
  
      await locker.increaseLocktime(1, OneYearsduration, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 
      
      lock1details =  await locker.loker(1);
      assert.equal(Number(lock1details.unlockTime), latestTime + 2*OneYearsduration);

    })

    it("User can create multiple lockers", async () => {
   
        const latestTime = Number((await time.latest()));
        const OneYearsduration = Number(await time.duration.years(1));

        let testCoin1 = await TestCoin.new();
        testCoinAddress1 = await testCoin1.address;
  
        await testCoin1._mint(user1, 20000000000000, { from: user1 });
        await testCoin1.approve(lockerAddress, 20000000000000, { from: user1 });
        await locker.lockTokens( 0, testCoinAddress1, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


        let testCoin2 = await TestCoin.new();
        testCoinAddress2 = await testCoin2.address;
  
        await testCoin2._mint(user1, 20000000000000, { from: user1 });
        await testCoin2.approve(lockerAddress, 20000000000000, { from: user1 });
        await locker.lockTokens( 0, testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

        let testCoin3 = await TestCoin.new();
        testCoinAddress3 = await testCoin3.address;
  
        await testCoin3._mint(user1, 20000000000000, { from: user1 });
        await testCoin3.approve(lockerAddress, 20000000000000, { from: user1 });
        await locker.lockTokens( 0, testCoinAddress3, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


        const locksListbyUser =  await locker.getLockersListbyUser(user1);
        assert.equal(String(locksListbyUser), "1,2,3");
    
        const locksListbyToken1 =  await locker.getLockersListbyToken(testCoinAddress1, {from: user1});
        const locksListbyToken2 =  await locker.getLockersListbyToken(testCoinAddress2, {from: user1});
        const locksListbyToken3 =  await locker.getLockersListbyToken(testCoinAddress3, {from: user1});
        assert.equal(Number(locksListbyToken1), 1 );
        assert.equal(Number(locksListbyToken2), 2 );
        assert.equal(Number(locksListbyToken3), 3 );
     
        const lock1details1 =  await locker.loker(1);
        assert.equal(String(lock1details1.owner), user1);
        assert.equal(String(lock1details1.tokenAddress), testCoinAddress1);
  
        const lock1details2 =  await locker.loker(2);
        assert.equal(String(lock1details2.owner), user1);
        assert.equal(String(lock1details2.tokenAddress), testCoinAddress2);

        const lock1details3 =  await locker.loker(3);
        assert.equal(String(lock1details3.owner), user1);
        assert.equal(String(lock1details3.tokenAddress), testCoinAddress3);

    });

    it("anyone can query locker IDs by user address", async () => {
  
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      let testCoin1 = await TestCoin.new();
      testCoinAddress1 = await testCoin1.address;

      await testCoin1._mint(user1, 20000000000000, { from: user1 });
      await testCoin1.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress1, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


      let testCoin2 = await TestCoin.new();
      testCoinAddress2 = await testCoin2.address;

      await testCoin2._mint(user1, 20000000000000, { from: user1 });
      await testCoin2.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      let testCoin3 = await TestCoin.new();
      testCoinAddress3 = await testCoin3.address;

      await testCoin3._mint(user1, 20000000000000, { from: user1 });
      await testCoin3.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress3, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


      const locksListbyUser =  await locker.getLockersListbyUser(user1);
      assert.equal(String(locksListbyUser), "1,2,3");

    });

    it("anyone can query locker IDs by token address", async () => {
  
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      let testCoin1 = await TestCoin.new();
      testCoinAddress1 = await testCoin1.address;

      await testCoin1._mint(user1, 20000000000000, { from: user1 });
      await testCoin1.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress1, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


      let testCoin2 = await TestCoin.new();
      testCoinAddress2 = await testCoin2.address;

      await testCoin2._mint(user1, 20000000000000, { from: user1 });
      await testCoin2.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      let testCoin3 = await TestCoin.new();
      testCoinAddress3 = await testCoin3.address;

      await testCoin3._mint(user1, 20000000000000, { from: user1 });
      await testCoin3.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress3, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
  
      const locksListbyToken1 =  await locker.getLockersListbyToken(testCoinAddress1, {from: user1});
      const locksListbyToken2 =  await locker.getLockersListbyToken(testCoinAddress2, {from: user1});
      const locksListbyToken3 =  await locker.getLockersListbyToken(testCoinAddress3, {from: user1});
      assert.equal(Number(locksListbyToken1), 1 );
      assert.equal(Number(locksListbyToken2), 2 );
      assert.equal(Number(locksListbyToken3), 3 );
    
      const lock1details1 =  await locker.loker(1);
      assert.equal(String(lock1details1.owner), user1);
      assert.equal(String(lock1details1.tokenAddress), testCoinAddress1);

      const lock1details2 =  await locker.loker(2);
      assert.equal(String(lock1details2.owner), user1);
      assert.equal(String(lock1details2.tokenAddress), testCoinAddress2);

      const lock1details3 =  await locker.loker(3);
      assert.equal(String(lock1details3.owner), user1);
      assert.equal(String(lock1details3.tokenAddress), testCoinAddress3);

    });

    it("User can withdraw their tokens partially in many turns once the locking time is over ", async () => {

      let userBalance;
      let lockerBalance;
      let latestTime;
      let lock1details;

      latestTime = Number((await time.latest()));
      // console.log("latestTime at start ", latestTime)

      const OneYearsduration = Number(await time.duration.years(1));

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress, 20000000000000, latestTime + 2*OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
    
      lock1details =  await locker.loker(1);
      assert.equal(String(lock1details.owner), user1);
      assert.equal(String(lock1details.tokenAddress), testCoinAddress);
      assert.equal(String(lock1details.unlockTime), latestTime + 2*OneYearsduration);
      assert.equal(Number(lock1details.numOfTokens), 20000000000000);

      userBalance = await testCoin.balanceOf(user1);
      lockerBalance = await testCoin.balanceOf(lockerAddress);
      
      assert.equal(Number(userBalance), 0);
      assert.equal(Number(lockerBalance), 20000000000000);

      let err = false;

      try {
        await locker.unlockTokens( 0, 1, 10000000000000, {from: user1});
      }
      catch(e){
        // console.log(e.reason)
        err = true
      }
      assert.equal( err, true);

      
      await time.increase(time.duration.years(1));
      latestTime = Number((await time.latest()));
      // console.log("latestTime after 1 year", latestTime)

      err = false;
      try {
        await locker.unlockTokens( 0, 1, 10000000000000, {from: user1});
      }
      catch(e){
        // console.log(e.reason)
        err = true
      }
      assert.equal( err, true);
      
      await time.increase(time.duration.years(1));
      latestTime = Number((await time.latest()));
      // console.log("latestTime after 2 year", latestTime);

      await locker.unlockTokens(1, 10000000000000, {from: user1});

      lock1details =  await locker.loker(1);
      assert.equal(Number(lock1details.numOfTokens), 10000000000000);

      userBalance = await testCoin.balanceOf(user1);
      lockerBalance = await testCoin.balanceOf(lockerAddress);
      
      assert.equal(Number(userBalance), 10000000000000);
      assert.equal(Number(lockerBalance), 10000000000000);

      err = false;
      try {
        await locker.unlockTokens(1, 10000000000001, {from: user1});
      }
      catch(e){
        // console.log(e.reason)
        err = true
      }
      assert.equal( err, true);

      await locker.unlockTokens( 1, 10000000000000, {from: user1});

      lock1details =  await locker.loker(1);
      assert.equal(Number(lock1details.numOfTokens), 0);

      userBalance = await testCoin.balanceOf(user1);
      lockerBalance = await testCoin.balanceOf(lockerAddress);
      
      assert.equal(Number(userBalance), 20000000000000);
      assert.equal(Number(lockerBalance), 0);


      err = false;
      try {
        await locker.unlockTokens( 1, 100, {from: user1});
      }
      catch(e){
        // console.log(e.reason)
        err = true
      }
      assert.equal( err, true);

    });

    it("User can withdraw their tokens at once the locking time is over ", async () => {

      let userBalance;
      let lockerBalance;
      let latestTime;
      let lock1details;

      latestTime = Number((await time.latest()));
      // console.log("latestTime at start ", latestTime)

      const OneYearsduration = Number(await time.duration.years(1));

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens( 0, testCoinAddress, 20000000000000, latestTime + 2*OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
    
      lock1details =  await locker.loker(1);
      assert.equal(String(lock1details.owner), user1);
      assert.equal(String(lock1details.tokenAddress), testCoinAddress);
      assert.equal(String(lock1details.unlockTime), latestTime + 2*OneYearsduration);
      assert.equal(Number(lock1details.numOfTokens), 20000000000000);

      userBalance = await testCoin.balanceOf(user1);
      lockerBalance = await testCoin.balanceOf(lockerAddress);
      
      assert.equal(Number(userBalance), 0);
      assert.equal(Number(lockerBalance), 20000000000000);
      
      await time.increase(time.duration.years(2));
      latestTime = Number((await time.latest()));
      // console.log("latestTime after 2 years", latestTime)

      await locker.unlockTokens( 1, 20000000000000, {from: user1});
      

    });

            
  });



})
