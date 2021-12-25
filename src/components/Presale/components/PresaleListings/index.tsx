import React from 'react'
import PresaleCard from './PresaleCard';
import Grid from '@mui/material/Grid';
// import {sales} from '../../dummyData';
import {Sale} from '../../../store';
import { useSelector } from 'react-redux';


function PresaleListings() {

    const {salesData} = useSelector((state: any) => state)

    return (
        <Grid container spacing={0} sx={{ border: "0px solid black" }}>
            {
                salesData.map((sale: Sale) => {
                    return (
                        <Grid item xs={12} lg={3} sx={{ border: "0px solid black" }} key={sale.id} >
                            <PresaleCard sale={sale} />
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

export default PresaleListings
