import React, {FC} from 'react'
import Grid from '@mui/material/Grid';
import {DetailContainer, PaiChartContainer, DiscriptionContainer, DiscriptionHeading} from './styles';
import {PresaleInfoProps} from './interfaces';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CachedIcon from '@mui/icons-material/Cached';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { useParams } from "react-router-dom"; 
import { useSelector } from 'react-redux';
import {Sale} from '../../../store';
import {PendingChip, FailourChip, SuccessChip, InProgressChip} from '../../common';
import {OnlyTokenHoldersChip, OnlyWhitelistedChip, OpenForAllChip} from '../../common';


const RightPane = () => {

    let params = useParams();
    const {salesData} = useSelector((state: any) => state)
    const sale: Sale = salesData.filter((sale: Sale) => sale.id === Number(params.presaleID))[0];



    const sx = {display: "flex", justifyContent: "flex-start"}

    // const EllipsisText = (props: any) => {
    //     const { children } = props
      
    //     return (
    //       <div style={{
    //         fontSize: "9px",
    //         fontWeight: 600,
    //         width: "100%",
            
    //         }}>
    //         {children}
    //       </div>
    //     )
    // }




    return (
        <DetailContainer>
          <Card variant="outlined">
            <DiscriptionContainer>
                <DiscriptionHeading> General Info </DiscriptionHeading>
                <Grid container>

                    <Grid item xs={12} sx={sx}>
                        Project ID: {sale.id}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Contract Address: {sale.tokenaddr}
                    </Grid>

                    <Grid item xs={12} sx={{border: "0px solid black", display: "flex", alignItems: "center"}}>
                        <div>Status: </div>
                        <div style={{border: "0px solid black", marginLeft: "3px", display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                            {
                                Number(sale.startTime) > Date.now() ?
                                <PendingChip />  
                                :
                                Number(sale.endingTime) < Date.now() && sale.saleProgress < 70 ?
                                <FailourChip />  
                                :
                                (Number(sale.endingTime) < Date.now()  &&  sale.saleProgress >= 70) || (sale.saleProgress === 100) ?
                                <SuccessChip />  
                                : 
                                <InProgressChip />
                            }
                            </div>

                    </Grid>

                    <Grid item xs={12} sx={{border: "0px solid black", display: "flex", alignItems: "center"}}>
                         <div>Type: </div>
                         <div style={{border: "0px solid black", marginLeft: "3px", display: "flex", justifyContent: "flex-start", alignItems: "center"}}>

                                    {
                                        sale.typeOfSale === "OpenForAll" && ( <OpenForAllChip /> )
                                    }
                                    
                                    {
                                        sale.typeOfSale === "OnlyWhiteListed" && ( <OnlyWhitelistedChip />  )
                                    }
                                    
                                    {
                                        sale.typeOfSale === "OnlyTokenHolders" && ( <OnlyTokenHoldersChip tokenName={sale.minimumTokens} /> )
                                    }

                            </div>
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Name: {sale.name}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Symbol: {sale.symbol}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Price of Each Token: {sale.price}
                    </Grid>

                    <Grid item xs = {12} sx={sx}>
                        Total on sale: {sale.tokensForSale}
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Liquidity: {sale.liquidity}
                    </Grid>

                    {/* <Grid item xs = {12}  sx={sx}>
                        Listing On: Pancakeswap
                    </Grid> */}

                    <Grid item xs = {12}  sx={sx}>
                        Remaining Tokens: 2,000
                    </Grid>
                    
                    <Grid item xs = {12}  sx={sx}>
                        Target Funds: 50 BNB
                    </Grid>
                    
                    <Grid item xs = {12}  sx={sx}>
                        Fund Raised: 5 BNB
                    </Grid>
                
                </Grid>
            </DiscriptionContainer>

            <Divider sx={{margin: 2}} />

            <DiscriptionContainer>
                <DiscriptionHeading> Counts </DiscriptionHeading>
                <Grid container>

                    <Grid item xs={12} sx={sx}>
                        Participants: 35
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Claims: 0
                    </Grid>

                </Grid>
            </DiscriptionContainer>

            <Divider sx={{margin: 2}} />

            <DiscriptionContainer>
                <DiscriptionHeading> Participation Criteria </DiscriptionHeading>
                <Grid container>

                    <Grid item xs={12} sx={sx}>
                        Criteria Token: {sale.criteriaToken}
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Min TokenFor Participation : {sale.minimumTokens}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Minimum Requested Tokens : {sale.minimumReq}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Maximum Requested Tokens : {sale.maximumReq}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Softcap : {sale.softCap}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Starting Time: {new Date(Number(sale.startTime)).toLocaleString("en-US")}
                    </Grid>

                    <Grid item xs = {12} sx={sx}>
                        Ending Time: {new Date(Number(sale.endingTime)).toLocaleString("en-US")}
                    </Grid>

                </Grid>
            </DiscriptionContainer>


            </Card> 


        </DetailContainer>
    )
}

export default RightPane


