import React, { useEffect, useState } from "react"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import "../../assets/css/font-awesome-5.10.2.min.css"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/normalize.css"
import "../../assets/css/plugin/animate.css"
import "../../assets/css/plugin/nice-select.css"

import Picnictableicon from "../../assets/img/table/picnictableicon.png"
import HeroImg from "../../assets/img/hero-img.png"


import Bannershap1 from "../../assets/img/bannershap-1.png"
import Bannercoin1 from "../../assets/img/bannercoin-1.png"
import Bannercoin2 from "../../assets/img/bannercoin-2.png"
import Bannercoin3 from "../../assets/img/bannercoin-3.png"

import Color1 from "../../assets/img/color-1.png"
import Color2 from "../../assets/img/color-2.png"
import Color3 from "../../assets/img/color-3.png"
import ExchangeImg from "../../assets/img/exchange-img.png"

import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../store';
import Web3 from "web3";


const Transaction = () => {

    const dispatch = useDispatch();

    const {userAddress} = useSelector((state: any) => state)



    return(
        // <!-- Transaction Start -->
        <div className="transaction" id="cryptocurrencies">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="search wow fadeInUp" data-wow-duration="0.5s" data-wow-delay="0.3s">
                            <form id="form">
                                <div className="form-group">
                                    <input type="text" name="number" placeholder="Search all available coins on Picnic Launchpad"
                                        className="form-control" />
                                    <button type="submit" className="button-1"> <i className="fas fa-search"></i>
                                        <span>Search</span></button>
                                </div>
                            </form>
                        </div>
                        <div className="transaction-box">
                            <div className="responsive-table">
                                <table className="table">
                                    <thead className="wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Symbol</th>
                                            <th scope="col">USD Price</th>
                                            <th scope="col">BNB Price</th>
                                            <th scope="col">Supply</th>
                                            <th scope="col">Sell</th>
                                            <th scope="col">Buy</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                                            <td>
                                                <div className="name">
                                                    <img className="coin" src={Picnictableicon} alt="" />
                                                    <span id="PICname"></span>
                                                </div>
                                            </td>
                                            <td>
                                                <span id="PICsymbol"></span>
                                            </td>
                                            <td>
                                                <span id="PICusd"></span>
                                            </td>
                                            <td>
                                                <span id="PICbnb"> 0.00651 </span>
                                            </td>
                                            <td>
                                                <span id="PICsupply">100,000</span>
                                            </td>
                                            <td><a style={{float: "right", marginRight: "13%"}}  className="button one">Sell</a></td>
                                            <td><a style={{float: "right", marginRight: "13%"}} className="button two">Buy</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}


export default Transaction;