import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
import  { setLoading,  setPICNICContractFn } from '../store';
import TokenABI from "../../abis/PICNIC.json";
import { PICNIC as PICNICType } from '../../../types/web3-v1-contracts/PICNIC'


export const LoadBlockchainData = async () => {

    const dispatch = useDispatch();

    dispatch(setLoading(true))
    // const web3 = new Web3("https://ropsten.infura.io/v3/92a3eada72834b629e28ff80ba4af4d0");
    // Initial web3 instance with current provider which is ethereum in our case
    const web3 = new Web3(window.ethereum);

    // Detect which Ethereum network the user is connected to
    let networkId = await web3.eth.net.getId()
    console.log(networkId)
    // const TokenData = TokenABI.networks[networkId]

    // Load Contract Data
    const tokenContract = (new web3.eth.Contract(TokenABI as any, "0x96D91c8f5eE3C4478854944A7523d8975094D2B3") as any) as PICNICType;
    // new web3.eth.Contract(TokenABI as any, "0x96D91c8f5eE3C4478854944A7523d8975094D2B3") as PICNIC 
    console.log(tokenContract)
    dispatch(setPICNICContractFn(tokenContract))
    
    
    const accounts = await window.web3.eth.getAccounts()

    const userBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
    console.log("userBalance ", userBalance)

    dispatch(setLoading(false))

  };