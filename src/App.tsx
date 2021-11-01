import './App.css';
import React, { useEffect, useState } from "react"
import Web3 from "web3";
import TokenABI from "./abis/PICNIC.json";
import {PICNIC as PICNICType} from '../types/web3-v1-contracts/PICNIC';
import Header from './components/Header';
import Banners from './components/Banners';
import Transaction from './components/Transaction';
import Process from './components/Process';
import Feature from './components/Feature';
import Gatway from './components/Gatway';
import Testomonial from './components/Testomonial';
import Counter from './components/Counter';
import Footer from './components/Footer';






import {LoadBlockchainData} from './components/utils/loadBlockchainData'
import {LoadWeb3} from './components/utils/loadWeb3'
import { useDispatch, useSelector } from 'react-redux';
import {  setPICNICContractFn, setActiveUser, setNetworkID } from  './components/store';


function App() {

  const dispatch = useDispatch();

  window.ethereum.on('accountsChanged', function (accounts: string[]) {
    dispatch(setActiveUser(accounts[0]));
  })


  const loadBlockchainData = async () => {
    const web3 = new Web3(window.ethereum);

    // Detect which Ethereum network the user is connected to
    let networkId = await web3.eth.net.getId()
    console.log(networkId)

    // if(networkId == 56){
      // alert("Please switch your network to Binance Smart chain")
    // }

    dispatch(setNetworkID(Number(networkId)));

    // Load Contract Data
    const tokenContract = (new web3.eth.Contract(TokenABI as any, "0x96D91c8f5eE3C4478854944A7523d8975094D2B3") as any) as PICNICType;
    console.log(tokenContract)
    dispatch(setPICNICContractFn(tokenContract))

    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });



    // const PICNICBalance = await tokenContract.methods.balanceOf(accounts[0]).call()

    // console.log("PICNICBalance ", PICNICBalance)




  }



  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div className="App">
      <Header />
      <Banners />
      <Transaction />
      <Process />
      <Feature />
      <Gatway />
      <Testomonial />
      <Counter />
      <Footer />

    </div>
  );
}

export default App;
