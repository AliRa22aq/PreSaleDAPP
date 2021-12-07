import React from 'react'
import {DetailContainer, PaiChartContainer, DiscriptionContainer} from './styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';


ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    labels: ['sold', 'remaining'],
    datasets: [
        {
        label: '# of Votes',
        data: [6666, 4444],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 0,
        },
    ],
    };

function Presale() {

    return (
        <DetailContainer>
                Body of presale

            <PaiChartContainer>
                <Doughnut data = {data} />
            </PaiChartContainer>

            {/* <DiscriptionContainer>

                <Grid container>
                    <Grid item xs={12} lg={6} sx={{border: "1px solid black"}}>
                        Total tokens on sale: 10000
                    </Grid>
                    <Grid item xs = {12} lg={6}>
                        Total tokens Sold: 6666
                    </Grid>
                    <Grid item xs = {12} lg={6}>
                        Total tokens Remaining: 4444
                    </Grid>
                    <Grid item xs = {12} lg={6}>
                        Minimum Contribution: 500
                    </Grid>
                    <Grid item xs = {12} lg={6}>
                        Maximum Contribution: 1000
                    </Grid>
                    <Grid item xs = {12} lg={6}>
                        Maximum Contribution: 1000
                    </Grid>

                    <Grid item xs = {12} lg={6}>
                        Starting time: 2/2/2022
                    </Grid>

                    <Grid item xs = {12} lg={6}>
                        Ending time: 3/3/2022
                    </Grid>

                </Grid>

            </DiscriptionContainer> */}
        </DetailContainer>
    )
}

export default Presale
