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

contract("Presale", (accounts) => {
  
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

  describe("Locking =>", () => {
    

    it("User can lock tokens", async () => {
      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens(testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
    
    });
      
    it("after locking, anyone can see his locked token info", async () => {

      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      
      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens(testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      const locksListbyUser =  await locker.getLockersListbyUser(user1);
      assert.equal(Number(locksListbyUser), 1);

  
      const locksListbyToken =  await locker.getLockersListbyToken(testCoinAddress, {from: user1});
      assert.equal(Number(locksListbyToken), 1);

      const contractBalance = await testCoin.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance), 20000000000000);
  
      const lock1details =  await locker.lockedToken(1);
      assert.equal(Number(lock1details.id), 1);
      assert.equal(String(lock1details.owner), user1);
      assert.equal(String(lock1details.token), testCoinAddress);
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
      await locker.lockTokens(testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

      contractBalance = await testCoin.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance), 20000000000000);
  
      lock1details =  await locker.lockedToken(1);
      assert.equal(Number(lock1details.numOfTokens), 20000000000000);

      await testCoin._mint(user1, 10000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 10000000000000, { from: user1 });
      await locker.addTokenstoALocker(1, 10000000000000, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 
      
      contractBalance = await testCoin.balanceOf(lockerAddress);
      assert.equal(Number(contractBalance), 30000000000000);
  
      lock1details =  await locker.lockedToken(1);
      assert.equal(Number(lock1details.numOfTokens), 30000000000000);

    })

    it("after locking, user can increase the locking period by paying update fee", async () => {
      
      let lock1details;

      const latestTime = Number((await time.latest()));
      const OneYearsduration = Number(await time.duration.years(1));

      await testCoin._mint(user1, 20000000000000, { from: user1 });
      await testCoin.approve(lockerAddress, 20000000000000, { from: user1 });
      await locker.lockTokens(testCoinAddress, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});
  
      await locker.increaseLocktime(1, OneYearsduration, {from: user1, value: web3.utils.toWei('0.05', 'ether')}); 
      
      lock1details =  await locker.lockedToken(1);
      assert.equal(Number(lock1details.unlockTime), latestTime + 2*OneYearsduration);

    })

    

    it("User can create multiple lockers", async () => {
   
        const latestTime = Number((await time.latest()));
        const OneYearsduration = Number(await time.duration.years(1));

        let testCoin1 = await TestCoin.new();
        testCoinAddress1 = await testCoin1.address;
  
        await testCoin1._mint(user1, 20000000000000, { from: user1 });
        await testCoin1.approve(lockerAddress, 20000000000000, { from: user1 });
        await locker.lockTokens(testCoinAddress1, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


        let testCoin2 = await TestCoin.new();
        testCoinAddress2 = await testCoin2.address;
  
        await testCoin2._mint(user1, 20000000000000, { from: user1 });
        await testCoin2.approve(lockerAddress, 20000000000000, { from: user1 });
        await locker.lockTokens(testCoinAddress2, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});

        let testCoin3 = await TestCoin.new();
        testCoinAddress3 = await testCoin3.address;
  
        await testCoin3._mint(user1, 20000000000000, { from: user1 });
        await testCoin3.approve(lockerAddress, 20000000000000, { from: user1 });
        await locker.lockTokens(testCoinAddress3, 20000000000000, latestTime + OneYearsduration, {from: user1, value: web3.utils.toWei('0.1', 'ether')});


        const locksListbyUser =  await locker.getLockersListbyUser(user1);
        assert.equal(String(locksListbyUser), "1,2,3");
    
        const locksListbyToken1 =  await locker.getLockersListbyToken(testCoinAddress1, {from: user1});
        const locksListbyToken2 =  await locker.getLockersListbyToken(testCoinAddress2, {from: user1});
        const locksListbyToken3 =  await locker.getLockersListbyToken(testCoinAddress3, {from: user1});
        assert.equal(Number(locksListbyToken1), 1 );
        assert.equal(Number(locksListbyToken2), 2 );
        assert.equal(Number(locksListbyToken3), 3 );
     
        const lock1details1 =  await locker.lockedToken(1);
        assert.equal(String(lock1details1.owner), user1);
        assert.equal(String(lock1details1.token), testCoinAddress1);
  
        const lock1details2 =  await locker.lockedToken(2);
        assert.equal(String(lock1details2.owner), user1);
        assert.equal(String(lock1details2.token), testCoinAddress2);

        const lock1details3 =  await locker.lockedToken(3);
        assert.equal(String(lock1details3.owner), user1);
        assert.equal(String(lock1details3.token), testCoinAddress3);

    });

    
            
});


})
