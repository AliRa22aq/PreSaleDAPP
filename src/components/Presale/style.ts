import styled from 'styled-components'
import Button from '@mui/material/Button';


export const PreRootContainer = styled.div`
        background-color: #f2f2f2;
        width: 100%;
        height: 100%;
        min-height: 100vh;
`;

export const StyledButton = styled(Button)`
`;

export const ButtonContainer = styled.div`
        /* border: 2px solid black; */
        display: flex;
        justify-content: right;
        justify-self: center;
`;


export const RootContainer = styled.div`
        /* border: 2px solid black; */
        width: 90%;
        /* height: 40%; */
        margin: auto;
        /* margin-top: 50px; */
        margin-bottom: 50px;
        /* padding: 20px; */
        background-color: #f2f2f2;

`;

export const HeaderContainer = styled.div`
        /* border: 2px solid black; */
        margin: 5px;
        padding: 5px;
        height: "100%";
        font-size: larger;
`;



export const FromContainer = styled.div`
        /* border: 2px solid black; */
        /* height: 100%; */

`;


export const FormHeader = styled.div`
        /* border: 2px solid black; */
        margin: 5px;
        padding: 5px;
        /* min-height: 100vh; */
        /* height: 100% */
        font-size: larger;
        /* font-size: 20px; 
        font-weight: 700; */

`;

export const FormBody = styled.div`
        /* border: 2px solid black; */
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




