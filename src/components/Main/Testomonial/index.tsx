import React, { useEffect, useState } from "react";
import "../../../assets/css/style.css";
import "../../../assets/css/responsive.css";
import "../../../assets/css/font-awesome-5.10.2.min.css";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/normalize.css";
import "../../../assets/css/plugin/animate.css";
import "../../../assets/css/plugin/nice-select.css";


import Tcoin1 from "../../../assets/img/tcoin-1.png";
import Tcoin2 from "../../../assets/img/tcoin-2.png";
import Tcoin3 from "../../../assets/img/tcoin-3.png";
import Tcoin4 from "../../../assets/img/tcoin-4.png";
import Tcoin15 from "../../../assets/img/tcoin-5.png";


import { Routes, Route, Link } from "react-router-dom";





import { useDispatch, useSelector } from "react-redux";
import { setNetworkID, setActiveUser, userWalletconnected } from "../../store";
import Web3 from "web3";

const Testomonial = () => {
  const dispatch = useDispatch();

  const { userAddress, userPincicInfo } = useSelector((state: any) => state);

  return (
    // <!-- testomonial Start -->
    <div className="testomonial" id="currentPresale">
      <div
        className="coin tcoin-1"
        data-paroller-factor="0.1"
        data-paroller-type="foreground"
        data-paroller-direction="horizontal"
      >
        <img src={Tcoin1} alt="" />
      </div>
      <div
        className="coin tcoin-2"
        data-paroller-factor="0.2"
        data-paroller-type="foreground"
        data-paroller-direction="horizontal"
      >
        <img src={Tcoin2} alt="" />
      </div>
      <div
        className="coin tcoin-3"
        data-paroller-factor="-0.1"
        data-paroller-type="foreground"
        data-paroller-direction="vertical"
      >
        <img src={Tcoin3} alt="" />
      </div>
      <div
        className="coin tcoin-4"
        data-paroller-factor="-0.1"
        data-paroller-type="foreground"
        data-paroller-direction="horizontal"
      >
        <img src={Tcoin4} alt="" />
      </div>
      <div
        className="coin tcoin-5"
        data-paroller-factor="-0.2"
        data-paroller-type="foreground"
        data-paroller-direction="horizontal"
      >
        <img src={Tcoin15} alt="" />
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div
            className="col-lg-10 text-center wow fadeInUp"
            data-wow-duration="0.2s"
            data-wow-delay="0.2s"
          >
            <div className="section-head">
              <h4 className="lasthead">Pre-Sale</h4>
              <h2 className="title">Join our latest presale today.</h2>
              {/* <p className="text">
                Current Launch: LockedUP (Requires 150 $PICNIC to join pre-sale)
              </p> */}
            </div>
          </div>
        </div>
        
        <div style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
          <div
            className="col-xl-6 col-md-6 wow fadeInUp"
            data-wow-duration="0.2s"
            data-wow-delay="0.2s"
          >
            <div className="testo-box">
              <div className="review">
                {/* <div style={{ display: "inline", textAlign: "left" }}>
                  <p className="text" id="selected-account"></p>
                  <p className="text" id="picnicHeld">
                    Picnic You Hold: {userPincicInfo.balance}
                  </p>
                </div>
                <br />
                <br />
                <div style={{ display: "inline", textAlign: "left" }}>
                  <p className="text" id="presaleCollected">
                    Amount Collected: 
                  </p>
                  <p className="text" id="bWalletBalance">
                    Booster Balance:
                  </p>
                </div>
                <br />
                <br />

                <p className="text">
                  <label htmlFor="amountToSend">
                    How much would you like to contribute?
                  </label>
                  <br />
                  <br />
                  <input
                    id="amountToSend"
                    type="text"
                    maxLength={3}
                    placeholder="0.1BNB - 1BNB"
                    required
                  />
                </p>*/}

                <br />
                
                <Link to="/presale">
                  {/* <a
                    style={{ display: "inline-block", width: "200px" }}
                    className="nav-link button-1"
                    id="sendCont"
                    // onClick={()=> {}}
                  >
                </a> */}
                  GO TO PRESALE SECTION
                
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testomonial;
