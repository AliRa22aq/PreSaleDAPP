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
                <Link to='form' style={{ textDecoration: 'none' }}>
                    <StyledButton size="small" variant="contained" > Start a Presale </StyledButton>
                </Link>
            </ButtonContainer >

            <PresaleHeader />
                
            <PresaleListings  />
                
            </RootContainer>
        </PreRootContainer>
    )
}

export default Presale
