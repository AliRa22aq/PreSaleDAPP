import React, { useEffect, useState } from "react"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import "../../assets/css/font-awesome-5.10.2.min.css"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/normalize.css"
import "../../assets/css/plugin/animate.css"
import "../../assets/css/plugin/nice-select.css"
import LOGO from "../../assets/img/logo.png"
import TokenABI from "../../abis/PICNIC.json";
import {PICNIC as PICNICType} from '../../../types/web3-v1-contracts/PICNIC';




import { useDispatch, useSelector } from 'react-redux';
import { setuserPicnicBalance, setNetworkID, setActiveUser, userWalletconnected, setPICNICContractFn } from '../store';
import Web3 from "web3";


const Header = () => {

    const dispatch = useDispatch();

    const {userAddress} = useSelector((state: any) => state)
    // console.log("userAddress ", userAddress)

    const ConnectWallet = async () => {
        
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);


            // Get current logged in user address
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            dispatch(userWalletconnected(true));


            // Detect which Ethereum network the user is connected to
            let networkId = await web3.eth.net.getId()
            console.log(networkId)

            // if(networkId == 56){
            // alert("Please switch your network to Binance Smart chain")
            // }

            dispatch(setNetworkID(Number(networkId)));


        
            const userCurrentAddress = accounts[0];
            dispatch(setActiveUser(userCurrentAddress));

            // Load Contract Data
            const tokenContract = (new web3.eth.Contract(TokenABI as any, "0x96D91c8f5eE3C4478854944A7523d8975094D2B3") as any) as PICNICType;
            console.log(tokenContract)
            dispatch(setPICNICContractFn(tokenContract))

            console.log("userCurrentAddress ", userCurrentAddress)

            const PICNICBalance = await tokenContract.methods.balanceOf(userCurrentAddress).call()

            console.log("PICNICBalance ", PICNICBalance)
            dispatch(setuserPicnicBalance(PICNICBalance))
        
      
          } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
          } else {
            window.alert(
              "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
          }



    
    }


    return(
        <div className="mein-menu">
        <nav className="navbar navbar-expand-lg navbar-dark ">
            <div className="container">
                <a className="navbar-brand" href="#topOfPage">
                    <img src={LOGO} className="logo" alt="logo" />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#topOfPage">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#cryptocurrencies">Cryptos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#aboutPIC">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#currentPresale">Pre-Sale</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://t.me/PICNICLaunchPad" target="_blank" rel="noopener noreferrer">Telegram</a>
                        </li>
                        <li className="nav-item">
                            {
                                userAddress ? 
                                <span> 
                                    {userAddress.slice(0,5)} ... {userAddress.slice(37)}                                
                                </span> : 
                                <a className="nav-link button-1" id="btn-connect" onClick= {ConnectWallet}>Connect Wallet</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>

    )
}


export default Header;