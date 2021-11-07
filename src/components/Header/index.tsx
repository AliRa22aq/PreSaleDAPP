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
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { useDispatch, useSelector } from 'react-redux';
import { setuserPicnicBalance, setNetworkID, setActiveUser, userWalletconnected, setPICNICContractFn } from '../store';
import Web3 from "web3";


interface Provider {
  cachedProvider: string;
  connect(): Promise<any>;
  connectTo(id: string): Promise<any>;
  toggleModal(): Promise<void>;
  on(event: string, callback: any): any;
  off(event: string, callback?: any): void;
  clearCachedProvider(): void;
  setCachedProvider(id: string): void;
  updateTheme(theme: string | any): Promise<void>;
}


const Header = () => {

    const dispatch = useDispatch();
    const {userAddress} = useSelector((state: any) => state)
    // const [provider, setProvider] = useState<Provider | null>(null);

    const ConnectWallet = async () => {
        
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);

            const providerOptions = {
                walletconnect: {
                  package: WalletConnectProvider,
                  options: {
                      rpc: {
                          56: 'https://bsc-dataseed.binance.org/:80'
                        },
                        network: 'binance',
                        chainId: 56,
                        infuraId: "5ba68febfb4b4ebc8b591b41f79ba72c",
                   }
                }
              };
            
            const web3Modal = new Web3Modal({
                cacheProvider: false, // optional
                providerOptions, // required
                disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
              });

            // await web3Modal.updateTheme("dark");

            await web3Modal.connect();
            // setProvider(web3Modal)
            // console.log(provider)

            dispatch(userWalletconnected(true));

            const chainId = await web3.eth.getChainId();
            dispatch(setNetworkID(Number(chainId)));
          
            // Get list of accounts of the connected wallet
            const accounts = await web3.eth.getAccounts();
            
            // MetaMask does not give you all accounts, only the selected account
            console.log("Got accounts", accounts);
            const selectedAccount = accounts[0];
            console.log(selectedAccount)
            dispatch(setActiveUser(selectedAccount));
            

            // Load Contract Data
            const tokenContract = (new web3.eth.Contract(TokenABI as any, "0x96D91c8f5eE3C4478854944A7523d8975094D2B3") as any) as PICNICType;
            console.log(tokenContract)
            dispatch(setPICNICContractFn(tokenContract))

            const PICNICBalance = await tokenContract.methods.balanceOf(selectedAccount).call()

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
                                  <span>  {userAddress.slice(0,5)}...{userAddress.slice(37)} </span>                                
                                : 
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