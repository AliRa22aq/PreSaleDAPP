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
import { useDispatch, useSelector } from 'react-redux';
import {  setPICNICContractFn, setActiveUser, setNetworkID } from  './components/store';


function App() {

  const dispatch = useDispatch();

  // window.ethereum.on('accountsChanged', function (accounts: string[]) {
  //   dispatch(setActiveUser(accounts[0]));
  // })

  // // Subscribe to chainId change
  // window.ethereum.on("chainChanged", (chainId: number) => {
  //   console.log("chainChanged", chainId);
  // });

  // // Subscribe to provider connection
  // window.ethereum.on("connect", (info: { chainId: number }) => {
  //   console.log("connect", info);
  // });

  // // Subscribe to provider disconnection
  // window.ethereum.on("disconnect", (error: { code: number; message: string }) => {
  //   console.log("disconnect", error);
  // });


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
