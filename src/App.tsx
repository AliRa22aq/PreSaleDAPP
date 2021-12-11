import './App.css';
import React, { useEffect, useState } from "react"
import Web3 from "web3";
import TokenABI from "./abis/PICNIC.json";
import {PICNIC as PICNICType} from '../types/web3-v1-contracts/PICNIC';
// import Header from './components/Header';
// import Banners from './components/Banners';
// import Transaction from './components/Transaction';
// import Process from './components/Process';
// import Feature from './components/Feature';
// import Gatway from './components/Gatway';
// import Testomonial from './components/Testomonial';
// import Counter from './components/Counter';
// import Footer from './components/Footer';
import Main from './components/Main';
import NotFound from './components/NotFound';
import Presale from './components/Presale';
import Layout from './components/Presale/components/Layout';
import PresaleForm from './components/Presale/components/PresaleForm';
import PresaleDetail from './components/Presale/components/PresaleDetail';

import { useDispatch, useSelector } from 'react-redux';
import {  setPICNICContractFn, setActiveUser, setNetworkID } from  './components/store'
import { Routes, Route, Link } from "react-router-dom";

function App() {

  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="*" element={<NotFound />}/>
        <Route path="presale" element={<Layout />}>
            <Route path="" element={<Presale />} /> 
            <Route path="form" element={<PresaleForm />} />
            <Route path=":presaleID" element={<PresaleDetail />} /> 
        </Route>       
      </Routes>

    </div>
  );
}

export default App;
