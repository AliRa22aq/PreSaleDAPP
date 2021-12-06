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
import FooterBG from  "../../../assets/img/footer-bg.png"
import LOGO from  "../../../assets/img/logo.png"








const Footer = () => {

    const dispatch = useDispatch();

    const {userAddress} = useSelector((state: any) => state)



    return(
        // <!-- Footer Start -->
        <div className="footer" style={{backgroundImage: `url(${FooterBG})`}}>
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-12 wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                        <div className="top-footer">
                            <div className="logo"><img src={LOGO} alt="" /></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.2s">
                        <div className="footer-box">
                            <h4 className="lasthead">Links</h4>
                            <ul className="footer-link">
                                <li><a href="#topOfPage">Home</a></li>
                                <li><a href="#cryptocurrencies">Cryptos</a></li>
                                <li><a href="#aboutPIC">About</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="0.4s" data-wow-delay="0.3s">
                        <div className="footer-box">
                            <h4 className="lasthead">&nbsp;</h4>
                            <ul className="footer-link">
                                <li><a href="#currentPresale">Pre-Sale</a></li>
                                <li><a href="https://t.me/PICNICLaunchPad" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                                <li><a >Buy $PICNIC</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                        <div className="footer-bottom">
                            <div className="content">
                                <p className="text">Copyright &copy; <a href="#">Picnic Launchpad</a> | <a href="#">2021</a> </p>
                            </div>
                            <div className="social-style">
                                <a href="https://twitter.com/picniclaunchpad" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                                <a href="https://t.me/PICNICLaunchPad" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="scrollUp" title="Scroll To Top">
                <i className="fas fa-arrow-up"></i>
            </div>
        </div>
        
    )
}

export default Footer;
{/* <!--====== Scroll To Top Start ======-->
<!--====== Scroll To Top End ======--> */}