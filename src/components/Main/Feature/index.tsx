import React, { useEffect, useState } from "react"
import "../../../assets/css/style.css"
import "../../../assets/css/responsive.css"
import "../../../assets/css/font-awesome-5.10.2.min.css"
import "../../../assets/css/bootstrap.min.css"
import "../../../assets/css/normalize.css"
import "../../../assets/css/plugin/animate.css"
import "../../../assets/css/plugin/nice-select.css"

import FeatureIcon1 from "../../../assets/img/feature-icon-1.png"
import FeatureIcon2 from "../../../assets/img/feature-icon-2.png"
import FeatureIcon3 from "../../../assets/img/feature-icon-3.png"
import FeatureIcon4 from "../../../assets/img/feature-icon-4.png"

import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../../store';
import Web3 from "web3";


const Feature = () => {

    const dispatch = useDispatch();

    const {userAddress} = useSelector((state: any) => state)



    return(
        // <!-- Feature Start -->
        <div className="feature">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="row">
                            <div className="col-lg-6  wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                                <div className="feature-box one">
                                    <div className="tumb">
                                    <img src={FeatureIcon1} alt="" />
                                    </div>
                                    <p className="text">
                                        The safe, secure,
                                        and easy way to new crypto launches
                                    </p>
    
                                </div>
                            </div>
                            <div className="col-lg-6  wow fadeInUp" data-wow-duration="0.4s" data-wow-delay="0.4s">
                                <div className="feature-box two">
                                    <div className="tumb">
                                        <img src={FeatureIcon2} alt="" />
                                    </div>
                                    <p className="text">
                                        Professional team with a passion for crypto
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-6  wow fadeInUp" data-wow-duration="0.5s" data-wow-delay="0.5s">
                                <div className="feature-box three">
                                    <div className="tumb">
                                    <img src={FeatureIcon3} alt="" />
                                    </div>
                                    <p className="text">
                                        Multi-Crypto Support
                                    </p>
    
                                </div>
                            </div>
                            <div className="col-lg-6  wow fadeInUp" data-wow-duration="0.6s" data-wow-delay="0.6s">
                                <div className="feature-box four">
                                    <div className="tumb">
                                    <img src={FeatureIcon4} alt="" />
                                    </div>
                                    <p className="text">
                                        Holders of $PICNIC always get priority access to launches
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 order-xl-last order-first  wow fadeInUp" data-wow-duration="0.4s"
                        data-wow-delay="0.4s">
                        <div className="section-head">
                            <h4 className="lasthead">Buy $PICNIC And Access The Newest,</h4>
                            <h2 className="title">Safe, Cryptocurrency Launch Platform.</h2>
                            <p className="text">
                                Here are a few reasons why you should choose Picnic Launchpad.
                            </p>
                            <a  className="button "><span>Buy $PICNIC Now!</span> <i
                                    className="fas fa-long-arrow-alt-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
    )
}


export default Feature;