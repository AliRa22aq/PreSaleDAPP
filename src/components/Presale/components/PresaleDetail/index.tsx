import React, {useState} from 'react'
import { useParams } from "react-router-dom";
import {RootContainer, PreRootContainer, FromContainer, FormBody} from '../../style';
import { SaleDetailHeader} from './styles';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import LeftPane from './LeftPane';
import RightPane from './RightPane';
import Presale from './Presale';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const borderWidth = 0;


function PresaleDetail() {

  let params = useParams();
  console.log(params);
  const [ownerView, setOwnerView] = useState(false)
  const [saleEnded, setSaleEnded] = useState(false)


  const handleSaleEnded = () => {
    console.log("Switching")
    setSaleEnded(!saleEnded)
    console.log("saleEnded => ", saleEnded)

  }

  const handleSwitch = () => {
    console.log("Switching")
    setOwnerView(!ownerView)
    console.log("Owner => ", ownerView)

  }

  

  
    return (
            <RootContainer >

            <Grid container sx={{border: process.env.REACT_APP_BORDER}}>

                <Grid item xs={12} >
                    <div style={{border: process.env.REACT_APP_BORDER, display: "flex", justifyContent: "flex-end", justifySelf: "center"}}>
                        <FormControlLabel onChange={handleSaleEnded} control={<Switch />} label="Sale Ended" />
                        <FormControlLabel onChange={handleSwitch} control={<Switch />} label="Owner View" />
                    </div>
                   <SaleDetailHeader > Welcome to Presale {params.presaleID} </SaleDetailHeader>
                </Grid>

                <Grid container spacing={0} sx={{border: process.env.REACT_APP_BORDER, minHeight: 600}}>

                    <Grid item xs={12} lg={3} sx={{border: process.env.REACT_APP_BORDER }}>
                        <LeftPane ownerView={ownerView} saleEnded= {saleEnded}/>
                    </Grid>

                    <Grid item xs={12} lg={6} sx={{border: process.env.REACT_APP_BORDER}}>
                        <Presale ownerView={ownerView} saleEnded= {saleEnded}/>
                    </Grid>

                    <Grid item xs={12} lg={3} sx={{border: process.env.REACT_APP_BORDER}}>
                        <RightPane saleID = {params.presaleID ? params.presaleID: "0"} />
                    </Grid>
    
                </Grid>


            </Grid>

            
            
            </RootContainer >
    )
}

export default PresaleDetail

