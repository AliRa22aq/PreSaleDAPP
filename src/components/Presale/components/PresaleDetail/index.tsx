import React from 'react'
import { useParams } from "react-router-dom";
import {RootContainer, PreRootContainer, FromContainer, SaleDetailHeader, FormBody} from '../../style';
import Grid from '@mui/material/Grid';
import Rules from './Rules'
import PresaleInfo from './PresaleInfo'
import Presale from './Presale'

// import { PieChart } from 'react-minimal-pie-chart';




function PresaleDetail() {

  let params = useParams();
  console.log(params);

    return (
        <PreRootContainer >
            <RootContainer >

            <Grid container sx={{border: "1px solid black"}}>

                <Grid item xs={12} >
                   <SaleDetailHeader> Welcome to Presale {params.presaleID} </SaleDetailHeader>
                </Grid>

                <Grid container spacing={0} sx={{border: "1px solid blue", minHeight: 600}}>

                    <Grid item xs={3} sx={{border: "1px solid black", }}>
                        <Rules />
                    </Grid>

                    <Grid item xs={6} sx={{border: "1px solid black"}}>
                        <Presale />
                    </Grid>

                    <Grid item xs={3} sx={{border: "1px solid black"}}>
                        <PresaleInfo />
                    </Grid>
    
                </Grid>


            </Grid>

            
            
            </RootContainer >
        </PreRootContainer >
    )
}

export default PresaleDetail

