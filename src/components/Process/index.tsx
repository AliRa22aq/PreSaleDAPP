import React, { useEffect, useState } from "react"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import "../../assets/css/font-awesome-5.10.2.min.css"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/normalize.css"
import "../../assets/css/plugin/animate.css"
import "../../assets/css/plugin/nice-select.css"

import Process1 from "../../assets/img/process-1.png"
import Process2 from "../../assets/img/process-2.png"
import Process3 from "../../assets/img/process-3.png"


import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../store';
import Web3 from "web3";


const Process = () => {

    const dispatch = useDispatch();

    const {userAddress, userPincicInfo} = useSelector((state: any) => state)



    return(
        // <!-- Process Start -->
        <div className="process" id="aboutPIC">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 text-center wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                        <div className="section-head">
                            <h4 className="lasthead">How to participate in Picnic Launchpad</h4>
                            <h2 className="title">It's really easy!</h2>
                            <p className="text">
                                It's easier than you think. Follow 3 simple easy steps.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xl-4 col-md-6 text-center  wow fadeInUp" data-wow-duration="0.3s" data-wow-delay="0.3s">
                        <div className="process-box">
                            <div className="tumb">
                                <img src={Process1} alt="" />
                            </div>
                            <p className="text">
                                Buy $PICNIC <br /> on PancakeSwap
                            </p>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6 text-center  wow fadeInUp" data-wow-duration="0.4s" data-wow-delay="0.4s">
                        <div className="process-box">
                            <div className="tumb">
                                <img src={Process2} alt="" />
                            </div>
                            <p className="text">
                                Hold $PICNIC  
                                <br />
                                in your wallet
                            </p>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6 text-center  wow fadeInUp" data-wow-duration="0.5s" data-wow-delay="0.5s">
                        <div className="process-box">
                            <div className="tumb">
                                <img src={Process3} alt="" />
                            </div>
                            <p className="text">
                                Get exclusive access to <br />
                                Picnic Launchpad pre-sales
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                
    )
}


export default Process;