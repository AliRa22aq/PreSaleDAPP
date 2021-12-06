import React, {FC} from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";

interface CardPros {
    id: number
}

const PresaleCardd: FC<CardPros> = ({id}) => {

    return (
            <Box sx={{margin: 1, height: 500}}>
                <Card variant="outlined" sx={{border: "2px solid black", height: "100%", width: "100%"}}>

                    <React.Fragment>
                        
                        <CardContent sx={{ border: "2px solid red", height: "80%", padding: 1}}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Presale # {id}
                            </Typography>
                        </CardContent>


                        <CardActions sx={{ border: "2px solid black" , height: "20%", justifyContent: "center", padding: 1}}>
                            <Link to={String(id)} >                        
                                    <Button variant="contained" sx={{ }}>
                                        Participate
                                    </Button>
                            </Link>
                        </CardActions>


                    </React.Fragment>
                 </Card>
             </Box>   
        )
}

export default PresaleCardd



