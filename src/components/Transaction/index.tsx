import React, { useEffect, useState } from "react"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import "../../assets/css/font-awesome-5.10.2.min.css"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/normalize.css"
import "../../assets/css/plugin/animate.css"
import "../../assets/css/plugin/nice-select.css"

import Picnictableicon from "../../assets/img/table/picnictableicon.png"

import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../store';
import Web3 from "web3";
import axios from 'axios'


interface Data {
    name: string,
    price: number,
    price_BNB: number,
    symbol: string
}

const InitalData  = {
    name: "PICNIC",
    price: 3.3177,
    price_BNB: 0.0061,
    symbol: "$PIC"
}


const Transaction = () => {

    const dispatch = useDispatch();
    const {userAddress} = useSelector((state: any) => state)
    const [staticData, setStaticData] = useState<Data>(InitalData)

    useEffect(()=>{
        const fetchData = async () => {
            const res: any = await axios.get("https://api.pancakeswap.info/api/v2/tokens/0x96d91c8f5ee3c4478854944a7523d8975094d2b3")
            setStaticData({name: res.data.data.name, price: Number(res.data.data.price), price_BNB: Number(res.data.data.price_BNB) , symbol:  res.data.data.symbol })
        }
        fetchData();
    }, [])


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
                                                    <span id="PICname"> {staticData?.name} </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span id="PICsymbol"> {staticData?.symbol}</span>
                                            </td>
                                            <td>
                                                <span id="PICusd"> {staticData?.price.toFixed(5)}</span>
                                            </td>
                                            <td>
                                                <span id="PICbnb"> {staticData?.price_BNB.toFixed(5)} </span>
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