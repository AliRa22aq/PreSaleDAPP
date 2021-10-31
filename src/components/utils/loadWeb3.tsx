import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
import { setNetworkID, setActiveUser, userWalletconnected } from '../store';


export const LoadWeb3 = async () => {

    const dispatch = useDispatch();

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log(window.web3.currentProvider.isMetaMask)

      // Get current logged in user address
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      dispatch(userWalletconnected(true));

      const userCurrentAddress = accounts[0];
      dispatch(setActiveUser(userCurrentAddress));

      let networkId = await web3.eth.net.getId()
      dispatch(setNetworkID(Number(networkId)));

    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };