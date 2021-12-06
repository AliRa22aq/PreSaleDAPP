import React, { useEffect, useState } from "react";
import "../../../assets/css/style.css";
import "../../../assets/css/responsive.css";
import "../../../assets/css/font-awesome-5.10.2.min.css";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/normalize.css";
import "../../../assets/css/plugin/animate.css";
import "../../../assets/css/plugin/nice-select.css";

import CounterBG from "../../../assets/img/counter-bg.png";

import { useDispatch, useSelector } from "react-redux";
import { setNetworkID, setActiveUser, userWalletconnected } from "../../store";
import Web3 from "web3";

const Counter = () => {
  const dispatch = useDispatch();

  const { userAddress } = useSelector((state: any) => state);

  return (
    // <!-- Counter Start -->
    <div className="counter">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="counter-box"
              style={{backgroundImage: `url(${CounterBG})`}}
            >
              <div
                className="page-counter wow fadeInUp"
                data-wow-duration="0.3s"
                data-wow-delay="0.2s"
              >
                <div className="counter-item">
                  <h2 className="title">
                    <span className="count-num">1</span>
                  </h2>
                  <p className="text">Launches</p>
                </div>
              </div>
              <div
                className="page-counter wow fadeInUp"
                data-wow-duration="0.4s"
                data-wow-delay="0.3s"
              >
                <div className="counter-item">
                  <h2 className="title">
                    <span className="count-num">36,000</span>
                  </h2>
                  <p className="text">$PICNIC Burned</p>
                </div>
              </div>
              <div
                className="page-counter wow fadeInUp"
                data-wow-duration="0.5s"
                data-wow-delay="0.4s"
              >
                <div className="counter-item">
                  <h2 className="title">
                    <span className="count-num">64,000</span>
                  </h2>
                  <p className="text">$PICNIC Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
