import React, {useState} from 'react'
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


function Header() {

    const [data, setData] = useState({account: "", chainID: 0});

    const [anchorEl, setAnchorEl] = useState<any | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: any) => {
      setAnchorEl(e.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const ConnectWallet = async () => {
          
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
  
          const providerOptions = {
              walletconnect: {
                package: WalletConnectProvider,
              }
            };
          
          const web3Modal = new Web3Modal({
              cacheProvider: false, // optional
              providerOptions, // required
              disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
              // theme: {
              //     background: "rgb(39, 49, 56)",
              //     main: "rgb(199, 199, 199)",
              //     secondary: "rgb(168, 78, 78)",
              //     border: "rgba(195, 195, 195, 0.14)",
              //     hover: "rgb(16, 26, 32)"
              //   }
              
            });
  
          // await web3Modal.updateTheme("dark");
  
          await web3Modal.connect();
          // setProvider(web3Modal)
          // console.log(provider)
  
          // dispatch(userWalletconnected(true));
  
          const chainId = await web3.eth.getChainId();
          console.log("chainId", chainId);
  
          // dispatch(setNetworkID(Number(chainId)));
        
          // Get list of accounts of the connected wallet
          const accounts = await web3.eth.getAccounts();
          
          // MetaMask does not give you all accounts, only the selected account
          console.log("accounts", accounts);
          const selectedAccount = accounts[0];
          console.log(selectedAccount)
          // dispatch(setActiveUser(selectedAccount));
          
          setData({account: selectedAccount, chainID: chainId})
  
          // Load Contract Data
          // const tokenContract = (new web3.eth.Contract(TokenABI as any, "0x96D91c8f5eE3C4478854944A7523d8975094D2B3") as any) as PICNICType;
          // console.log(tokenContract)
          // dispatch(setPICNICContractFn(tokenContract))
  
          // const PICNICBalance = await tokenContract.methods.balanceOf(selectedAccount).call()
  
          // console.log("PICNICBalance ", PICNICBalance)
          // dispatch(setuserPicnicBalance(PICNICBalance))
      
    
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
  
    }

    return (
      <Grid container sx={{ height: "75px", background: "#f2f2f2", border: "0px solid black", display: "flex", justifyContent: "space-between" }}>  

            <Grid item xs={4} md={2} lg={2} sx={{ border: "0px solid black", height: "100%", width: "20%", fontSize:"14px", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center"}}>
                PICNIC Launchpad
            </Grid>


            <Grid item xs={8} md={5} lg={3} sx={{ border: "0px solid black", height: "100%", width: "25%", display: "flex"}}>
                
                <Box sx={{border: "0px solid black", width: "40%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                {
                    data.account && data.chainID === 97 ?
                    <Button variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}> 
                    BNC Testnet
                    </Button> :
                    data.account && data.chainID === 56 ?
                    <Button variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}>
                    BNC Mainnet
                    </Button>
                    :
                    null
                }
                </Box>

                <Box sx={{border: "0px solid black", width: "40%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Button onClick= {ConnectWallet} variant="text" sx={{width: "90%", fontSize:"14px", fontWeight: 600, bgcolor: "#fff", textTransform:  "none"}}> 
                    {
                        data.account ?  <>  {`${data.account.slice(0,5)}...${data.account.slice(38,43)}`} </> : <> Connect Wallet </>
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
