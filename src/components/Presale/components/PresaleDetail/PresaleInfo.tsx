import React, {FC} from 'react'
import Grid from '@mui/material/Grid';
import {DetailContainer, PaiChartContainer, DiscriptionContainer, DiscriptionHeading} from './styles';
import {PresaleInfoProps} from './interfaces';

const PresaleInfo: FC<PresaleInfoProps> = ({saleID}) => {

    const sx = {display: "flex", justifyContent: "flex-start"}



    return (
        <DetailContainer>
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

                    <Grid item xs={12} sx={sx}>
                        Type of Project: Open
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




        </DetailContainer>
    )
}

export default PresaleInfo


