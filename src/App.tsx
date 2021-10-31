import './App.css';
import React, { useEffect, useState } from "react"
import Web3 from "web3";
import TokenABI from "./abis/PICNIC.json";
import {PICNIC} from '../types/web3-v1-contracts/PICNIC';
import Header from './components/Header'
import {LoadBlockchainData} from './components/utils/loadBlockchainData'
import {LoadWeb3} from './components/utils/loadWeb3'
import { useDispatch, useSelector } from 'react-redux';
import {  setNetworkID, setActiveUser, userWalletconnected } from  './components/store';


interface Data{
  userAddress: string,
  loading: boolean,
  picnicBalance: number,
  picnicCotract: null | PICNIC
}
function App() {

  const dispatch = useDispatch();

  window.ethereum.on('accountsChanged', function (accounts: string[]) {
    dispatch(setActiveUser(accounts[0]));
  })


  useEffect(() => {
    LoadWeb3()
    LoadBlockchainData()
  }, [])


  // useEffect(() => {
  //   if (data.userAddress) {
  //     loadBlockchainData()
  //   }
  // }, [data.userAddress, data.transfered])

  return (
    <div className="App">
      <Header />

    </div>
  );
}

export default App;
