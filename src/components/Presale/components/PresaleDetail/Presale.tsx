import React, {useState, useEffect, FC} from 'react'
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
import { SvgIcon } from '@mui/material';

import Discord from '../assets/Disord.svg';
import { FaDiscord } from "react-icons/fa";
import { FaTwitter, FaTelegramPlane } from "react-icons/fa";





import { useParams } from "react-router-dom"; 
import { useSelector } from 'react-redux';
import {Sale} from '../../../store';
import {  setSaleProgress, setStatus } from '../../../store';

// import {PendingChip, FailourChip, SuccessChip, InProgressChip} from '../../common';
// import {OnlyTokenHoldersChip, OnlyWhitelistedChip, OpenForAllChip} from '../../common';



const LeftPane: FC<PresaleProps> = ({ownerView, saleEnded}) => {

    
    let params = useParams();
    const {salesData} = useSelector((state: any) => state)
    const sale: Sale = salesData.filter((sale: Sale) => sale.id === Number(params.presaleID))[0];

    
    
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        
        const timer = setInterval(() => {
            setSaleProgress({id: sale.id, saleProgress: progress})

            console.log("progress", progress)
            console.log("Progress of the project", sale.id, sale.saleProgress);
            setProgress((prevProgress) => ( 
                
                Date.now() < Number(sale.startTime) ?  0 :
                Date.now() > Number(sale.startTime) && Date.now() < Number(sale.endingTime) && prevProgress < 5 ? 
                prevProgress + 1 : prevProgress
                
                ));
                
            }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const style = {display: "flex", justifyContent: "center", fontWeight: 400, fontSize: "14px" }

    const CountDownComponent = () => {
        return (
            <>
            {
              progress == 100 ?
                <div style={{ fontSize: "20px", fontWeight: 600 }}> Sold Out</div> :
                <Countdown
                    date={Number(sale.startTime) > Date.now() ?  Number(sale.startTime) :   Number(sale.endingTime)}
                    renderer={renderer}
                    />
            }
            </>
            )
    }

    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
            // Render a completed state
            return <div style={{ fontSize: "20px", fontWeight: 600 }}> The Sale has been ended </div>;
        } else {
            // Render a countdown
            return (
                <div>
                    {
                        Number(sale.startTime) > Date.now() ? 
                        <>
                            <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "-5px" }}> Presale Starts In </div> 
                        </>
                        :
                        <>
                            <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "-5px" }}> Presale Ends In </div>
                        </>

                        }
                    <div style={{ fontSize: "18px", fontWeight: 600 }}> {days}:{hours}:{minutes}:{seconds} </div>

                    {/* <div style={{ fontSize: "16px", fontWeight: 600 }}> {days}:{hours}:{minutes}:{seconds} </div> */}
                </div>
            )
        }
    };

    const border = "0px solid black"

    return (
        <DetailContainer>
          <Card variant="outlined">

                <PresaleSubContainer style={{minHeight: "200px"}}>                
                    <Grid container spacing= {0} sx={{padding: 1  }}> 
                    <Grid item xs={2.5} lg={1.75} sx={{border, display: "flex", justifyContent: "center"}}> 
                    {
                        sale.image ?
                            <Avatar sx={{ bgcolor: "#d65555", width: 75, height: 75 }} src={sale.image} /> :
                            <Avatar sx={{ bgcolor: "#d65555", width: 75, height: 75 }}> {sale.name.slice(0,1)} </Avatar>
                    }
                    </Grid>
                    
                        <Grid item xs={3} lg={2} sx={{border: "0px solid blue"}}>
                            <div 
                                style={{
                                    // border: "1px solid blue", 
                                    height: "10%", 
                                    }}> </div>
                                                                        
                            <div 
                                style={{
                                    border: "0px solid blue", 
                                    height: "40%", 
                                    display: "flex",
                                    fontSize: "20px", fontWeight: 600
                                    }}> {sale.name} </div>
                            
                            <div style={{
                                    // border: "1px solid blue",
                                    height: "35%", 
                                    display: "flex", 
                                    fontSize: "16px", fontWeight: 400
                                    }}>  {sale.symbol}  </div>

                            <div style={{
                                    height: "15%", 
                                    }}>  </div>

                        </Grid>

                        <Grid item xs={3.5} lg={5.25} sx={{border: "0px solid blue", display: "flex", justifyContent: "flex-end"}} />

                        <Grid item xs={3} sx={{border, display: "flex", justifyContent: "flex-end"}}> 
                                
                                
                                <a href="https://www.google.com" target="_blank">  
                                    <LanguageIcon sx={{border: "0px solid black", width: "40px", height: "20px"}}/>  
                                </a>
                                <a href="https://www.discord.com/" target="_blank">  
                                    <FaDiscord style={{border: "0px solid black", width: "40px", height: "20px"}}/>
                                </a>
                                <a href="https://www.twitter.com" target="_blank">  
                                    <FaTwitter style={{border: "0px solid black", width: "40px", height: "20px"}}/>
                                </a>
                                <a href="https://www.telegram.com" target="_blank">  
                                    <FaTelegramPlane style={{border: "0px solid black", width: "40px", height: "20px"}}/>
                                </a>
                                
                                
                        </Grid>

                        <Grid item component="p" xs={12} sx={{border, marginTop: 1, textAlign: "left"}}> 
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, 
                                content here', making it look like readable English.
                        </Grid>

                    </Grid>

                </PresaleSubContainer>

                <Divider sx={{margin: "10px"}}/>

                <PresaleSubContainer style={{border: "0px solid black", padding: 5}}>
                    <CountDownComponent />
                </PresaleSubContainer>

                <Divider sx={{margin: "10px"}}/>

                {
                    !ownerView && (
                        <>
                            <PresaleSubContainer style={{border: "0px solid black", padding: 5}}>       
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
                                                <div style={{ display: "flex",  justifyContent: "center", alignItems: "center"}}>
                                                    <div style={{
                                                        border:"1px solid #b1aeae", 
                                                        width: "205px", 
                                                        display: "flex", 
                                                        padding: 0.5,
                                                        borderRadius: "5px"
                                                        }}
                                                        >
                                                        <Field
                                                            type="number"
                                                            name="tokens"                                                                                
                                                            label="Tokens"
                                                            style={{width: "140px", height: "30px", border:"0px solid #b1aeae"}}
                                                        />
                                                        <Button 
                                                            size="small" 
                                                            style={{
                                                                width: "50px", 
                                                                height: "30px", 
                                                                border:"0px solid #b1aeae", 
                                                                display: "flex" , justifyContent: "center",
                                                                fontWeight: 500, fontSize: "12px" }}>
                                                            Max 
                                                    </Button> 
                                                    </div>
                                                    <span style={{display: "flex" , 
                                                                    justifyContent: "center", 
                                                                    alignSelf: "center",
                                                                    fontWeight: 700, 
                                                                    fontSize: "12px" 
                                                                    }}>   &nbsp; {sale.symbol} </span>
                                                </div>
                                                
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    size= "small"
                                                    sx={{ margin: 1}}
                                                >
                                                    Buy
                                                </Button>
                                            </Form>
                                        )}

                                    </Formik> 
                                    :
                                    <Button
                                    variant="contained"
                                        color="primary"
                                        type="submit"
                                        size= "small"
                                        sx={{ margin: 1}}
                                        >
                                            Claim Tokens / Refund
                                    </Button>
                                }
                            </PresaleSubContainer>

                            <Divider sx={{margin: "10px"}}/>
                
                        </>
                    )
                }
                

                {
                    !ownerView && !saleEnded && (
                        <PresaleSubContainer>
                            <Grid container>
                                <Grid xs={6} item sx={{border: "0px solid black", }}> 
                                    <div style={{fontSize: "16px", fontWeight: 600, margin: 1}}> Allowed </div>

                                    <div>
                                        <div style={style}> 
                                            Tokens: 10,000 ALIC
                                        </div>
                                    </div>
                                </Grid>
                                
                                <Grid xs={6} item sx={{border: "0px solid black", }}> 
                                    
                                    <div style={{fontSize: "16px", fontWeight: 600, margin: 1}}> Your Contributions </div>
                                    
                                    <div>
                                        <div style={style}> 
                                            Value: 2 BNB
                                        </div>

                                        <div style={style}> 
                                            Tokens: 100,000 ALI
                                        </div>

                                        <div style={style}> 
                                            WhiteListed: False
                                        </div> 
                                    </div>

                                </Grid>
                            </Grid>
                        </PresaleSubContainer>
                    )
                }


                {
                    !ownerView && saleEnded && (
                        <PresaleSubContainer>
                                <Grid xs={12} item sx={{border: "0px solid black", }}> 
                                    
                                    <div style={{fontSize: "16px", fontWeight: 600, margin: 1}}> Your Controbution </div>
                                    
                                    <div>
                                        <div style={style}> 
                                            Value: 2 BNB
                                        </div>

                                        <div style={style}> 
                                            Tokens: 100,000 ALI
                                        </div>

                                        {/* <div style={style}> 
                                            WhiteListed: False
                                        </div>  */}
                                    </div>

                                </Grid>
                        </PresaleSubContainer>
                    )
                }


                {
                    ownerView && !saleEnded && (
                        <PresaleSubContainer>
                            <Grid container sx={{border: "0px solid black", }}>
                                
                             <Grid xs={12} item > 

                                <p style={{border: "0px solid black", margin: 5}}> 
                                    Sale is still in progress. Once it is done, you can end it so participants can claim their tokens or a refund 
                                </p>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ margin: 1}}
                                >
                                    End Sale
                                </Button>    

                                </Grid>
                            </Grid>
                        </PresaleSubContainer>

                    )
                }


                {
                    ownerView && saleEnded && (
                        <PresaleSubContainer>
                                <Grid xs={12} item sx={{border: "0px solid black", }}> 
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ margin: 1}}
                                    disabled
                                >
                                    End Sale
                                </Button>    

                                </Grid>
                        </PresaleSubContainer>
                    )
                }

          </Card>
        </DetailContainer>
    )
}

export default LeftPane