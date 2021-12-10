import React, {useState, FC} from 'react'
import {DetailContainer, PaiChartContainer, ParticipationDetails,ParticipationDetailsBody, ParticipationDetailsHeading, PresaleSubContainer} from './styles';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';



import { Form, Formik, Field } from "formik";
import { TextField } from 'formik-material-ui';
// import { RootContainer, StyledButton, FormSubHeading, FromContainer, FormHeader, FormBody } from '../../style';
import Countdown from "react-countdown";
import {PresaleProps} from './interfaces';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';


const Presale: FC<PresaleProps> = ({ownerView, saleEnded}) => {

    const style = {display: "flex", justifyContent: "start", marginLeft: "5px"}


    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
        // Render a completed state
        return <div style={{fontSize: "20px", fontWeight: 700}}> The Sale has been ended </div>;
        } else {
        // Render a countdown
        return (
            <div style={{color: "#ff4747"}}>
                <div style={{fontSize: "20px", fontWeight: 700, marginBottom: "-10px"}}> Presale Ends in </div>
                <div style={{fontSize: "40px", fontWeight: 900}}> {days}:{hours}:{minutes}:{seconds} </div>
            </div>
        )}
    };

    const border = "0px solid black"

    return (
        <DetailContainer>
          <Card variant="outlined">


          <PresaleSubContainer style={{minHeight: "200px"}}>
                
                <Grid container spacing= {0} sx={{padding: 1  }}> 
                  
                  <Grid item xs={1.75} lg={1.75} sx={{border, display: "flex", justifyContent: "center"}}> 
                    <Avatar sx={{ bgcolor: "#d65555" , width: 75, height: 75}}>A</Avatar>
                  </Grid>
                  
                    <Grid item xs={2} lg={1.5} sx={{border}}>
                        <div 
                            style={{
                                // border: "1px solid blue", 
                                height: "10%", 
                                }}> </div>
                                                                    
                        <div 
                            style={{
                                // border: "1px solid blue", 
                                height: "40%", 
                                display: "flex",
                                fontSize: "20px", fontWeight: 600
                                }}> Ali Coin </div>
                        
                        <div style={{
                                // border: "1px solid blue",
                                height: "35%", 
                                display: "flex", 
                                fontSize: "16px", fontWeight: 400
                                }}>  ALIC </div>

                        <div style={{
                                height: "15%", 
                                }}>  </div>

                    </Grid>
                    <Grid item xs={5.25} lg={5.75} sx={{border}}> 
                    </Grid>

                    <Grid item xs={3} sx={{border, display: "flex", justifyContent: "flex-end"}}> 
                            <LanguageIcon fontSize="small" sx={{margin: 1}}/>  
                            <TelegramIcon fontSize="small" sx={{margin: 1}}/>  
                            <TwitterIcon fontSize="small" sx={{margin: 1}}/>  
                    </Grid>

                    <Grid item component="p" xs={12} sx={{border, marginTop: 1, textAlign: "left"}}> 
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                            The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, 
                            content here', making it look like readable English.
                    </Grid>

                </Grid>

            </PresaleSubContainer>


            <Divider sx={{margin: "10px"}}/>

            <PresaleSubContainer>
                <Countdown 
                    date={saleEnded ? Date.now() : Date.now() + 50000000}
                    renderer={renderer}
                    />
            </PresaleSubContainer>

            <Divider sx={{margin: "10px"}}/>

            
            <PresaleSubContainer>
                
            {
                !ownerView ?
                <>
                <ParticipationDetailsHeading> Participant Info </ParticipationDetailsHeading>
                <ParticipationDetailsBody> 

                    <Grid container sx={{border: `0px solid black`}}>

                        <Grid item xs={12} lg={3} sx={{border: `0px solid black`}}> 
                            <ParticipationDetailsHeading> Allowed </ParticipationDetailsHeading>
                            <ParticipationDetailsBody>
                                <div style={style}> 
                                    Tokens: 1000 ALI
                                </div>
                            </ParticipationDetailsBody>
                        </Grid>

                        <Grid item xs={12} lg={6} sx={{border: `0px solid black`}}> 
        
                            <ParticipationDetailsHeading> Participate in this Crowd sale </ParticipationDetailsHeading>

                            <ParticipationDetailsBody>
                            {
                                !saleEnded ?

                            <Formik 
                                initialValues={{ tokens: 5000 }}
                                // validationSchema={schema1} 
                                onSubmit={async (values, { setFieldValue }) => {
                                    console.log(values);
                                }}>

                                {() => (
                                        <Form>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                sx={{ margin: 2}}
                                            >
                                                Buy
                                            </Button>
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="tokens"
                                                    label="Tokens"
                                                    // fullWidth
                                                    sx={{width: "100px", height: "20px"}}
                                                />
                                        </Form>
                                )}
                            </Formik> 
                            :
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ margin: 1}}
                                >
                                    Claim Tokens / Refund
                            </Button>
                        }
                            </ParticipationDetailsBody>

                        
                        </Grid>


                        <Grid item xs={12} lg={3} sx={{border: process.env.REACT_APP_BORDER}}> 
            
                            <ParticipationDetailsHeading> Your Contributions </ParticipationDetailsHeading>
                            <ParticipationDetailsBody>
                                <div style={style}> 
                                    Value: 0 BNB
                                </div>
                                <div style={style}> 
                                    Tokens: 0 ALI
                                </div>
                                <div style={style}> 
                                    WhiteListed: False
                                </div>                                
                            </ParticipationDetailsBody>

                        </Grid>
                    </Grid>
                </ParticipationDetailsBody>
                </> 
                
                : 
                <>

                <ParticipationDetailsHeading> Owner Info </ParticipationDetailsHeading>

                <ParticipationDetailsBody> 

                    <Grid container sx={{border: process.env.REACT_APP_BORDER}}>
                        <Grid item xs={3} sx={{border: process.env.REACT_APP_BORDER}}> A </Grid>
                        <Grid item xs={6} sx={{border: process.env.REACT_APP_BORDER}}> B </Grid>
                        <Grid item xs={3} sx={{border: process.env.REACT_APP_BORDER}}> 
                        <ParticipationDetailsHeading>  </ParticipationDetailsHeading>
                            <ParticipationDetailsBody>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ marginBottom: 1, width: "100%"}}
                                disabled = {saleEnded ? true:false}
                            >
                                Pause Sale
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ marginBottom: 1, width: "100%"}}
                                disabled = {saleEnded ? true:false}

                            >
                                End Sale
                            </Button>
                            </ParticipationDetailsBody>

                        </Grid>
                    </Grid>
                </ParticipationDetailsBody>
                </> 

                }


            </PresaleSubContainer>




          </Card>
        </DetailContainer>
    )
}

export default Presale
