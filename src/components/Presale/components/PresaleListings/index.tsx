import React from 'react'
import PresaleCard from './PresaleCard';
import Grid from '@mui/material/Grid';
import {sales} from '../../dummyData';
import {Sale} from '../../interfaces';


function PresaleListings() {

    const ids = [1, 2, 3, 4, 5, 6, 7];





    return (
        <Grid container spacing={0} sx={{ border: "0px solid black" }}>
            {
                sales.map((sale: Sale) => {
                    return (
                        <Grid item xs={12} lg={3} sx={{ border: "0px solid black" }}>
                            <PresaleCard sale={sale} />
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

export default PresaleListings
