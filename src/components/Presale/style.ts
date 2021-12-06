import styled from 'styled-components'
import Button from '@mui/material/Button';



export const PreRootContainer = styled.div`
        border: 2px solid black;
        background-color: lightcoral;
        width: 100%;
        height: 100%;
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
        background-color: white;

`;

export const HeaderContainer = styled.div`
        border: 2px solid violet;
        margin: 5px;
        padding: 5px;
        height: 50px;
        font-size: larger;
`;