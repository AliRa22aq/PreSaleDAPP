import React from 'react'

import PresaleListings from './components/PresaleListings';
import PresaleHeader from './components/PresaleHeader';

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import {RootContainer, StyledButton, PreRootContainer, ButtonContainer} from './style'


function Presale() {

    return (
        <PreRootContainer >
            <RootContainer >

            <ButtonContainer >
                <Link to='form' >
                    <StyledButton size="small" variant="contained" sx={{top: 1,  right: 1 }}> Start a Presale </StyledButton>
                </Link>
            </ButtonContainer >


            <PresaleHeader />
                
            <PresaleListings  />

            </RootContainer>
        </PreRootContainer>
    )
}

export default Presale
