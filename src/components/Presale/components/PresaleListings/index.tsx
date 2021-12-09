import React from 'react'
import PresaleCard from './PresaleCard';
import Grid from '@mui/material/Grid';

function PresaleListings() {

    const ids = [1,2,3,4,5,6,7];



    return (
        <Grid container  spacing={0} sx={{border:"0px solid black"}}>
            {/* <Grid item xs={12}>
                    Hello I am header, you can put any details in me
            </Grid> */}
        {
                ids.map((id: number) => {
                    return(
                        <Grid item xs={12} lg={3}  sx={{border: "0px solid black"}}>
                            <PresaleCard id={id}/>
                        </Grid>
                    )
                })
        }
        </Grid>
    )
}

export default PresaleListings
