import React from 'react'
import PresaleListings from './components/PresaleListings';

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { RootContainer, StyledButton, PreRootContainer, ButtonContainer } from './style'


function Presale() {

    return (
        <RootContainer >

            <PresaleListings />

        </RootContainer>
    )
}

export default Presale
