import React, {useState} from 'react'
import { Outlet } from "react-router-dom";
import {RootContainer, StyledButton, PreRootContainer, ButtonContainer} from '../../style'
import Divider from '@mui/material/Divider';
import Header from './Header';


const Layout = () => {

    return (
      <PreRootContainer >

        <Header />



              <Divider sx={{marginBottom: 1}}/>
          <Outlet />
        </PreRootContainer >
    );
  }

export default Layout
