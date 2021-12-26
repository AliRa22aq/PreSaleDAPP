import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
const PresaleABI =  require('../../../../abis/Presale.json');

import { setPresaleData, PresaleData, setuserPicnicBalance, setNetworkID, setActiveUser, userWalletconnected, setPICNICContractFn } from '../../../store';


const presaleContractAddress = "0x468C63e7c71CC54e7D7481916214222c6Ac24C48"

function Header() {
    const dispatch = useDispatch();
    let web3: any;

    // const web3 = new Web3(window.ethereum);

    // const [data, setData] = useState({account: "", chainID: 0});
    const {userAddress, networkID} = useSelector((state: any) => state)
    // console.log("networkID", networkID)


    const [anchorEl, setAnchorEl] = useState<any | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: any) => {
      setAnchorEl(e.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  

    useEffect(()=> {
      ConnectWallet();
    }, [])


    const ConnectWallet = async () => {
        
      if (window.ethereum) {
          web3 = new Web3(window.ethereum);

      } else if (window.web3) {
          web3 = new Web3(window.web3.currentProvider);
      } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          // options: {
          //     rpc: {
          //         56: 'https://bsc-dataseed.binance.org/:80'
          //       },
          //       network: 'binance',
          //       chainId: 56,
          //       infuraId: "5ba68febfb4b4ebc8b591b41f79ba72c",
          //   }
        }
      };
      
      const web3Modal = new Web3Modal({
          cacheProvider: false, // optional
          providerOptions, // required
          disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
          // theme: {
          //     background: "rgb(39, 49, 56)",
          //     main: "rgb(199, 199, 199)",
          //     secondary: "rgb(136, 136, 136)",
          //     border: "rgba(195, 195, 195, 0.14)",
          //     hover: "rgb(16, 26, 32)"
          //   }
          
        });

      // await web3Modal.updateTheme("dark");

      await web3Modal.connect();

      // dispatch(userWalletconnected(true));

      const chainId = await web3.eth.getChainId();
      dispatch(setNetworkID(Number(chainId)));
    
      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();
      
      // MetaMask does not give you all accounts, only the selected account
      console.log("Got accounts", accounts);
      const selectedAccount = accounts[0];
      console.log(selectedAccount)
      dispatch(setActiveUser(selectedAccount));
          

      console.log(PresaleABI)
      // Load Contract Data
      const presaleContract =  await new web3.eth.Contract(PresaleABI.abi, presaleContractAddress);

      const upfrontFee = await presaleContract.methods.upfrontfee().call();
      const percentageFee = await presaleContract.methods.salesFeeInPercent().call();



      // console.log("PICNICBalance ", PICNICBalance)
      const presaleData: PresaleData = {
        contractAddress: presaleContractAddress,
        methods: presaleContract.methods,
        upforntFee : upfrontFee,
        percentageFee: percentageFee
        
      }
      console.log("presaleData ", presaleData)
      
      dispatch(setPresaleData(presaleData))
      
  
    }

    return (
      <Grid container sx={{ height: "75px", background: "#f2f2f2", border: "0px solid black", display: "flex", justifyContent: "space-between" }}>  

            <Grid item xs={4} md={2} lg={2} sx={{ border: "0px solid black", height: "100%", width: "20%", fontSize:"14px", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center"}}>
                PICNIC Launchpad
            </Grid>


            <Grid item xs={8} md={5} lg={3} sx={{ border: "0px solid black", height: "100%", width: "25%", display: "flex"}}>
                
                <Box sx={{border: "0px solid black", width: "40%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                {
                    userAddress && networkID === 97 ?
                    <Button variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}> 
                    BNC Testnet
                    </Button> :
                    userAddress && networkID === 56 ?
                    <Button variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}>
                    BNC Mainnet
                    </Button>
                    :
                    userAddress && networkID !== 56 && networkID !== 97 ?
                    <Button variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}>
                    Not BSC
                    </Button> 
                    :
                    null
                }
                </Box>

                <Box sx={{border: "0px solid black", width: "40%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Button onClick= {ConnectWallet} variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}> 
                    {
                        userAddress ?  <>  {`${userAddress.slice(0,5)}...${userAddress.slice(38,43)}`} </> : <> Connect Wallet </>
                    }
                </Button>
                </Box>

                <div style={{border: "0px solid black", width: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>

                <MoreHorizIcon onClick={handleClick} sx={{width: "80%", height: "30px", background: "#fff", borderRadius: "5px", cursor: "pointer"}} />

                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button'}}>
                    <Link to='form' style={{ textDecoration: 'none', color: "black" }}>
                    <MenuItem onClick={handleClose}>Start a Presale</MenuItem>
                    </Link>

                </Menu>

                </div>

            </Grid>

      </Grid>
    )
}

export default Header
