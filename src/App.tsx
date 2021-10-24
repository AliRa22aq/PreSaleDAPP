import './App.css';
import React, { useEffect, useState } from "react"
import Web3 from "web3";
// import TokenABI = require("./abis/Token.json");
// import TokenType from '../types/web3-v1-contracts/TokenName';

function App() {

  const [data, setData] = useState({userAddress: ""});

  window.ethereum.on('accountsChanged', function (accounts: string[]) {
    setData(pre => { return { ...pre, userAddress: accounts[0] } })
  })


  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log(window.web3.currentProvider.isMetaMask)

      // Get current logged in user address
      const accounts = await window.web3.eth.getAccounts()
      setData(pre => { return { ...pre, userAddress: accounts[0] } })
      console.log(accounts[0])

    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {

    setData(pre => { return { ...pre, loading: true } })
    // const web3 = new Web3("https://ropsten.infura.io/v3/92a3eada72834b629e28ff80ba4af4d0");
    // Initial web3 instance with current provider which is ethereum in our case
    const web3 = new Web3(window.ethereum);

    // Detect which Ethereum network the user is connected to
    // let networkId = await web3.eth.net.getId()
    // const TokenData = TokenABI.networks[networkId]

    // setData(pre => { return { ...pre, farmtokenAddress: farmTokenData.address } })


    // Load Contract Data
    // const tokenContract = new web3.eth.Contract(TokenABI.abi, TokenData.address)

    // setData(pre => { return { ...pre, contract: tokenContract } })


    // setData(pre => { return { ...pre, loading: false } })

  };


  useEffect(() => {
    loadWeb3()
  }, [])


  // useEffect(() => {
  //   if (data.userAddress) {
  //     loadBlockchainData()
  //   }
  // }, [data.userAddress, data.transfered])

  return (
    <div className="App">
      <h2> Let's DeFi </h2>
      <br />
      {
        data.userAddress ?
          <div>You are login with Address: {data.userAddress}</div> :
          <>
            <div>Please Signin to Metamask</div>
            <br />
            <button onClick={() => loadWeb3()}> Connect </button>
          </>
      }

      <br />

    </div>
  );
}

export default App;
