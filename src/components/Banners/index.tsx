import React, { useEffect, useState } from "react"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import "../../assets/css/font-awesome-5.10.2.min.css"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/normalize.css"
import "../../assets/css/plugin/animate.css"
import "../../assets/css/plugin/nice-select.css"

import Background from "../../assets/img/banner-bg.png"
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


const Banners = () => {

    const dispatch = useDispatch();

    const {userAddress} = useSelector((state: any) => state)



    return(
        // <!-- Banners Start -->
        <div className="banner" id="topOfPage" style={{backgroundImage: `url(${Background})` }}>
            
            <div className="man">
                <img src={HeroImg} alt="" />
            </div>

            <div className="shape">
                <img src={Bannershap1} alt="" className="shapone" />
                <img src={Bannercoin1} alt="" className="coin-one" />
                <img src={Bannercoin2} alt="" className="coin-two" />
            </div>

            <div className="shape-right">
                <img src={Bannercoin3} alt="" className="right-coin" />
            </div>

            <div className="color color-1"><img src={Color1} alt="" /></div>
            <div className="color color-2"><img src={Color2} alt="" /></div>
            <div className="color color-3"><img src={Color3} alt="" /></div>
    
            <div className="hero-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-xl-7 col-lg-6 wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                            <div className="banner-content">
                                <h3 className="subtitle">Safe, Trusted and Secure!</h3>
                                <h1 className="head">Buy $PICNIC & Get Exclusive Access To Our Launches</h1>
                                <p className="text">
                                    Picnic Launchpad is the home of safe coin launches. Grab some $PICNIC today!
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 wow fadeInRight" data-wow-duration="0.3s" data-wow-delay="0.3s">
                            <div className="right-box">
                                <div className="exchange">
                                    <div className="exchange-box">
                                        <div className="selector">
                                            <p className="text">You have</p>
                                            <div className="coin">
                                                <div className="language-select">
                                                    <select className="select-bar">
                                                        <option value="">$PICNIC</option>
                                                        <option value="">BNB</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <form action="#" id="faq-form">
                                            <div className="form-group">
                                                <input type="text" name="number" placeholder="0" className="form-control" />
                                            </div>
                                        </form>
                                        <span className="rate">-</span>
                                    </div>
                                    <div className="exchange-box">
                                        <div className="selector">
                                            <p className="text">You Get</p>
                                            <div className="coin">
                                                <div className="language-select">
                                                    <select className="select-bar">
                                                        <option value="">BNB</option>
                                                        <option value="">$PICNIC</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <form action="#" id="faq-form-2">
                                            <div className="form-group">
                                                <input type="text" name="number" placeholder="0"
                                                    className="form-control" />
                                            </div>
                                        </form>
                                        <span className="rate">-</span>
                                    </div>
    
                                    <div className="button-box">
                                        <a className="rotate" href="#"><img src={ExchangeImg} alt="" /></a>
    
                                        <a href="#" className="button button-1">Trade</a>
                                    </div>
                                </div>
                                <div className="review">
    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    
    )
}


export default Banners;