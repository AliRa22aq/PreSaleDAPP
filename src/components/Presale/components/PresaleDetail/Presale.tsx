import React, {useState, FC} from 'react'
import {DetailContainer, PaiChartContainer, ParticipationDetails,ParticipationDetailsBody, ParticipationDetailsHeading, CountdownContainer} from './styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { Form, Formik, Field } from "formik";
import { TextField } from 'formik-material-ui';
import { RootContainer, StyledButton, FormSubHeading, FromContainer, FormHeader, FormBody } from '../../style';
import Countdown from "react-countdown";
import {PresaleProps} from './interfaces';


ChartJS.register(ArcElement, Tooltip, Legend);


const data = {
    labels: ['sold', 'remaining'],
    datasets: [
        {
        label: '# of Votes',
        data: [6666, 4444],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 0,
        },
    ],
    };

const Presale: FC<PresaleProps> = ({ownerView, saleEnded}) => {

    // const [ownerView, setOwnerView] = useState(false)
    const style = {display: "flex", justifyContent: "start", marginLeft: "5px"}

    const Completionist = () => <span>The Sale has been ended. You can claim your tokens</span>;
    // Renderer callback with condition
    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
        // Render a completed state
        return <Completionist />;
        } else {
        // Render a countdown
        return (
            <div>
                <div style={{fontSize: "20px", fontWeight: 700, marginBottom: "-10px"}}> Presale Ends in </div>
                <div style={{fontSize: "40px", fontWeight: 900}}> {days}:{hours}:{minutes}:{seconds} </div>
            </div>
        )}
    };

    return (
        <DetailContainer>

            <PaiChartContainer>
                <Doughnut data = {data} />
            </PaiChartContainer>

            <CountdownContainer>
                <Countdown 
                    date={Date.now() + 50000000}
                    renderer={renderer}
                    >
                    <Completionist />
                </Countdown>            
            </CountdownContainer>
            
            <ParticipationDetails>
                
            {
                !ownerView ?
                <>
                <ParticipationDetailsHeading> Participant Info </ParticipationDetailsHeading>
                <ParticipationDetailsBody> 

                    <Grid container sx={{border: `${process.env.REACT_APP_BORDER}px solid black`}}>

                        <Grid item xs={12} lg={3} sx={{border: process.env.REACT_APP_BORDER}}> 
                            <ParticipationDetailsHeading> Allowed </ParticipationDetailsHeading>
                            <ParticipationDetailsBody>
                                <div style={style}> 
                                    Tokens: 1000 ALI
                                </div>
                            </ParticipationDetailsBody>
                        </Grid>

                        <Grid item xs={12} lg={6} sx={{border: process.env.REACT_APP_BORDER}}> 
        
                            <ParticipationDetailsHeading> Participate in this Crowd sale </ParticipationDetailsHeading>

                            <ParticipationDetailsBody>
                            {
                                !saleEnded ?

                            <Formik 
                                initialValues={{ tokens: 500 }}
                                // validationSchema={schema1} 
                                onSubmit={async (values, { setFieldValue }) => {
                                    console.log(values);
                                }}>

                                {() => (
                                        <Form>
                                            {/* <Grid item xs={12} sx={{ margin: 0 }} > */}

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
                                                    sx={{width: "100px", height: "30px"}}
                                                />
                                            {/* </Grid> */}
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


            </ParticipationDetails>





        </DetailContainer>
    )
}

export default Presale
