import React from 'react'
import {RootContainer, StyledButton, PreRootContainer, FromContainer, FormHeader, FormBody} from '../../style';
import Grid from '@mui/material/Grid';
import InputForm from './Form'


function PresaleForm() {
    return (
        <PreRootContainer >
            <RootContainer >

            <Grid container spacing={0} sx={{border: process.env.REACT_APP_BORDER}}>

                <Grid item xs ={12} lg={3} sx={{border: process.env.REACT_APP_BORDER, height: 650}}>
                
                    <FormHeader >
                        Crowd Sale Rules
                    </FormHeader >

                    <FormBody>

                        Hello wrold

                    </FormBody>

                
                </ Grid>
                
                <Grid item xs ={12} lg={9} sx={{border: process.env.REACT_APP_BORDER}}>
                        <FormHeader >
                            Crowd Sale Form
                        </FormHeader >

                        <FormBody>
                            <InputForm />
                        </FormBody>
                    
                </ Grid>

            </ Grid>

            </RootContainer >
        </PreRootContainer >
    )
}

export default PresaleForm
