import React, {useState} from 'react'
import {RootContainer, PreRootContainer, FromContainer, FormBody} from '../../style';
import { SaleDetailHeader} from './styles';
import { useParams } from "react-router-dom"; 
import { useSelector } from 'react-redux';
import {Sale} from '../../../store';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import LeftPane from './LeftPane';
import RightPane from './RightPane';
import Presale from './Presale';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const borderWidth = 0;


const PresaleDetail = () => {

  let params = useParams();
  const {salesData} = useSelector((state: any) => state)
  const sale: Sale = salesData.filter((sale: Sale) => sale.id === Number(params.presaleID))[0];
//   console.log("params", sale);



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
                        <RightPane />
                    </Grid>
    
                </Grid>


            </Grid>

            
            
            </RootContainer >
    )
}

export default PresaleDetail

