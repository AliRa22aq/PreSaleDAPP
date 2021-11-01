import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../store';


export const ConnectWallet = async () => {

    const dispatch = useDispatch();
    
    // Get current logged in user address
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    dispatch(userWalletconnected(true));

    const userCurrentAddress = accounts[0];
    dispatch(setActiveUser(userCurrentAddress));

}