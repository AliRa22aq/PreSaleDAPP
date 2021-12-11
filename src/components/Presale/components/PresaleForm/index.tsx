import React from 'react'
import {RootContainer, StyledButton, PreRootContainer, FromContainer, FormHeader, FormBody} from '../../style';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import InputForm from './Form'


function PresaleForm() {
    return (
            <RootContainer >

            <Grid container spacing={0} sx={{}}>

                {/* <Grid item xs ={12} lg={3} >
                    <FormHeader >
                        Crowd Sale Rules
                    </FormHeader >

                    <FormBody>
                    <Card sx={{height: 300}}>
                            Hello wrold
                    </Card>
                    </FormBody>
                
                </ Grid> */}
                
                <Grid item xs ={12}  sx={{border: "0px solid black"}}>
                        <FormHeader >
                            Crowd Sale Form
                        </FormHeader >

                        <FormBody>
                            <InputForm />
                        </FormBody>
                    
                </ Grid>

            </ Grid>

            </RootContainer >
    )
}

export default PresaleForm
