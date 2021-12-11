import React, {FC} from 'react'
import Grid from '@mui/material/Grid';
import {DetailContainer, PaiChartContainer, DiscriptionContainer, DiscriptionHeading} from './styles';
import {PresaleInfoProps} from './interfaces';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';


const PresaleInfo: FC<PresaleInfoProps> = ({saleID}) => {

    const sx = {display: "flex", justifyContent: "flex-start"}

    const EllipsisText = (props: any) => {
        const { children } = props
      
        return (
          <div style={{
            fontSize: "9px",
            width: "100%",
            
            }}>
            {children}
          </div>
        )
      }

    return (
        <DetailContainer>
          <Card variant="outlined">
            <DiscriptionContainer>
                <DiscriptionHeading> General Info </DiscriptionHeading>
                <Grid container>

                    <Grid item xs={12} sx={sx}>
                        Project ID: {saleID}
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Contract Address: 0x000000000000
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Status: In Progress
                    </Grid>

                    <Grid item xs={12} sx={{border: "0px solid black", display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                         <div>Type: </div>
                         <div>
                            <Tooltip title="This project is open for everyone">
                                <Chip 
                                    variant="filled" 
                                    // color="success"
                                    sx={{ width: 80, height: 20, bgcolor: "#00ff9dea", marginLeft: "5px"}}
                                    icon={<LockOpenIcon sx={{width: 12, height: 12}}/>}
                                    label={<EllipsisText> Open for all</EllipsisText>}
                                    size="small"
                                    />
                            </Tooltip>

                                {/* <Chip 
                                    variant="filled" 
                                    color="info"
                                    sx={{ width: 95, height: 20}}
                                    icon={<LockIcon sx={{width: 10, height: 10}}/>}
                                    label={<EllipsisText> Only Whitelisted </EllipsisText>}
                                    size="small"
                                    /> */}

                                {/* <Chip 
                                    variant="filled" 
                                    color="info"
                                    sx={{ width: 110, height: 20}}
                                    icon={<LockIcon sx={{width: 10, height: 10}}/>}
                                    label={<EllipsisText> Only Token holders </EllipsisText>}
                                    size="small"
                                    /> */}

                            </div>
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Name: Ali Coin
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Symbol: ALI
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Price of Each Token: 0.2 BNB
                    </Grid>

                    <Grid item xs = {12} sx={sx}>
                        Total on sale: 10000
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Reserved Tokens for Liquidity: 7000
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Remaining Tokens: 2000
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Accumulated Banalcce: 5.68 BNB
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
                        Criteria Token: 0x000000000000
                    </Grid>

                    <Grid item xs = {12}  sx={sx}>
                        Min TokenFor Participation : 0
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Minimum Requested Tokens : 500
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Maximum Requested Tokens : 10000
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Softcap : 5000
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Starting Time: 2/2/2020 5 A.M. (GMT)
                    </Grid>

                    <Grid item xs = {12} sx={sx}>
                        Ending Time: 2/2/2020 5 A.M. (GMT)
                    </Grid>

                </Grid>
            </DiscriptionContainer>


            </Card> 


        </DetailContainer>
    )
}

export default PresaleInfo


