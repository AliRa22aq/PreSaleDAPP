import React from 'react'
import Grid from '@mui/material/Grid';
import {DetailContainer, PaiChartContainer, DiscriptionContainer} from './styles';

function PresaleInfo() {

    const sx = {display: "flex", justifyContent: "flex-start"}



    return (
        <DetailContainer>
            Detail of the project
            <DiscriptionContainer>

                <Grid container>
                    <Grid item xs={12} sx={sx}>
                        Contract Address: 0x000000000000
                    </Grid>
                    <Grid item xs={12} sx={sx}>
                        Name: Ali Coin
                    </Grid>
                    <Grid item xs={12} sx={sx}>
                        Symbol: ALI
                    </Grid>

                    <Grid item xs={12} sx={sx}>
                        Total tokens on sale: 10000
                    </Grid>
                    <Grid item xs = {12}  sx={sx}>
                        Total tokens Sold: 6666
                    </Grid>
                    <Grid item xs = {12} sx={sx}>
                        Total tokens Remaining: 4444
                    </Grid>
                    <Grid item xs = {12} sx={sx}>
                        Minimum Contribution: 500
                    </Grid>
                    <Grid item xs = {12} sx={sx}>
                        Maximum Contribution: 1000
                    </Grid>
                    <Grid item xs = {12} sx={sx}>
                        Maximum Contribution: 1000
                    </Grid>

                    <Grid item xs = {12} sx={sx}>
                        Starting time: 2/2/2022
                    </Grid>

                    <Grid item xs = {12} sx={sx}>
                        Ending time: 3/3/2022
                    </Grid>
                    <Grid item xs = {12} sx={sx}>
                        Time remaining: 4 hours, 33 mintues
                    </Grid>

                </Grid>

            </DiscriptionContainer>

        </DetailContainer>
    )
}

export default PresaleInfo
