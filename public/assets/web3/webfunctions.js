//Handles Wallet Connection


let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");


var account0;


web3.eth.getAccounts().then(function(result){
	account0 = result[0];
	document.getElementById('selected-account').innerHTML = "Connected Wallet: " + account0;
	getBoostBalance();
})


async function loadWeb3() {
	await window.web3.currentProvider.enable();
}


window.ethereum.on('accountsChanged', function (accountChange) {
	account0 = accountChange[0];
	document.getElementById('selected-account').innerHTML = "Connected Wallet: " + account0;
	getBoostBalance();
})


//Handles Website Functions

document.querySelector("#metamaskSelect").addEventListener("click", loadWeb3);
document.querySelector("#sendCont").addEventListener("click", sendPSF);

//var boosterWallet = '0x082Ffeaf6e38fAc93fcf48bF5E87BcDDf6305639';
//var boostBalance;

//async function getBoostBalance() {
//web3.eth.getBalance(boosterWallet).then(function(bSTBalance){
//	boostBalance = web3.utils.fromWei(bSTBalance, 'ether');
//	document.getElementById('bWalletBalance').innerHTML = "Booster Wallet: " + boostBalance + " BNB";
//})}

//Handles Presale Functions


var presaleWallet = '0xDEfc7d8A921CED3fAc8eBB69B65dd98778B7Bec7';
var amountTS;

async function sendPSF() {
	var aTSBNB = web3.utils.toWei('0.035', 'ether');
	if (whitelist.includes(account0) == true) {
    const sendPresale = await web3.eth.sendTransaction({to: presaleWallet, from: account0, value:(aTSBNB)});
	} else {
	console.log('Not Whitelisted');
	}
}

//Whitelist

let whitelist = ['0x43588f9E8df8b51990bfBd91ad08b3235f35eF88',
'0x5254c8D9dd804aa5d2490cdA13761C66c9320f53']