import React, { useEffect, useState } from "react"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import "../../assets/css/font-awesome-5.10.2.min.css"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/plugin/animate.css"
import "../../assets/css/plugin/nice-select.css"





const Header = () => {
    return(
        <div className="mein-menu">
        <nav className="navbar navbar-expand-lg navbar-dark ">
            <div className="container">
                <a className="navbar-brand" href="#topOfPage">
                    <img src="assets/img/logo.png" className="logo" alt="logo" />
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
                            <a className="nav-link button-1" id="btn-connect" onClick= {() => {}}>Connect Wallet</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>

    )
}


export default Header;