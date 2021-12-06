// import './App.css';
// import React, { useEffect, useState } from "react"
// import Web3 from "web3";
// import TokenABI from "./abis/PICNIC.json";
// import {PICNIC as PICNICType} from '../types/web3-v1-contracts/PICNIC';
import Header from './Header';
import Banners from './Banners';
import Transaction from './Transaction';
import Process from './Process';
import Feature from './Feature';
import Gatway from './Gatway';
import Testomonial from './Testomonial';
import Counter from './Counter';
import Footer from './Footer';
// import { useDispatch, useSelector } from 'react-redux';
// import {  setPICNICContractFn, setActiveUser, setNetworkID } from  './components/store';


const Main = () => {
    return(
        <>
            <Header />
            <Banners />
            <Transaction />
            <Process />
            <Feature />
            <Gatway />
            <Testomonial />
            <Counter />
            <Footer />
        </>    
    )
}


export default Main;
