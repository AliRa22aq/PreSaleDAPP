import styled from 'styled-components'
import Button from '@mui/material/Button';
// import { MuiThemeProvider, createMuiTheme } from '@mui/material/styles';



// declare module '@mui/material/styles' {
//         interface Theme {
//           status: {
//             danger: string;
//           };
          
//         }
//         // allow configuration using `createTheme`
//         interface ThemeOptions {
//           status?: {
//             danger?: string;
//           };
//         }
//       }
      


export const PreRootContainer = styled.div`
        border: 2px solid black;
        background-color: #000;
        /* background: linear-gradient(to bottom right, #6600ff 0%, #ff99cc 100%); */
        width: 100%;
        height: 100%;
        min-height: 100vh;
        
`;

export const StyledButton = styled(Button)`
`;

export const ButtonContainer = styled.div`
        border: 2px solid black;
        display: flex;
        justify-content: right;
        justify-self: center;

`;



export const RootContainer = styled.div`
        border: 2px solid black;
        width: 90%;
        /* height: 40%; */
        margin: auto;
        margin-top: 50px;
        margin-bottom: 50px;
        /* padding: 20px; */
        background-color: #f2f2f2;

`;

export const HeaderContainer = styled.div`
        border: 2px solid black;
        margin: 5px;
        padding: 5px;
        height: 50px;
        font-size: larger;
`;



export const FromContainer = styled.div`
        border: 2px solid black;
        /* height: 100%; */

`;


export const FormHeader = styled.div`
        border: 2px solid black;
        margin: 5px;
        padding: 5px;
        /* min-height: 100vh; */
        /* height: 100% */
        font-size: larger;
        /* font-size: 20px; 
        font-weight: 700; */

`;

export const FormBody = styled.div`
        border: 2px solid black;
        margin: 5px;
        padding: 5px;
        /* min-height: 500px; */
        height: calc(100% - 60px);
        font-size: larger;
        color: black;
        text-align: start;
`;

export const FormSubHeading = styled.div`
        /* border: 2px solid black; */
        /* margin-right: 50px;
        width: '100%'; */

`;


export const SaleDetailHeader = styled.div`
        border-style: solid;
        border-width: 0px 0px 2px 0px; /* 25px top, 10px right, 4px bottom and 35px left */
        margin-bottom: 10px;
        font-size: 20px; 
        font-weight: 700;
        /* margin-right: 50px;
        width: '100%'; */

`;

