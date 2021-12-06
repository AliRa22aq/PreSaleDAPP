import React, { useEffect, useState } from "react"
import "../../../assets/css/style.css"
import "../../../assets/css/responsive.css"
import "../../../assets/css/font-awesome-5.10.2.min.css"
import "../../../assets/css/bootstrap.min.css"
import "../../../assets/css/normalize.css"
import "../../../assets/css/plugin/animate.css"
import "../../../assets/css/plugin/nice-select.css"
import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../../store';
import Web3 from "web3";

import MethodIcon from "../../../assets/img/method-icon.png"
import PICNICLogo2 from "../../../assets/img/picniclogo2.png"
import BNBLogo from "../../../assets/img/bnb_logo.png"
import EthLogo from "../../../assets/img/eth_logo.png"




const Gatway = () => {

    const dispatch = useDispatch();

    const {userAddress} = useSelector((state: any) => state)



    return(
        // <!-- Getway Start -->
        <div className="getway">
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-lg-5 wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="0.6s">
                        <div className="content">
                            <div className="tumb">
                                <img src={MethodIcon} alt="" />
                            </div>
                            <h3 className="subtitle">Cryptos We Currently Support:</h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card-box">
                                <img className="payment-card wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.1s" src={PICNICLogo2} alt="$PICNIC" />
                                <img className="payment-card wow fadeInUp" data-wow-duration="0.4s" data-wow-delay="0.2s" src={BNBLogo} alt="BNB" />
                                <img className="payment-card wow fadeInUp" data-wow-duration="0.5s" data-wow-delay="0.3s" src={EthLogo} alt="ETH" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
                    
    )
}


export default Gatway;