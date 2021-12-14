import React, { FC, useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Divider from '@mui/material/Divider';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';

import Chip from '@mui/material/Chip';

import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import PendingIcon from '@mui/icons-material/Pending';
import Tooltip from '@mui/material/Tooltip';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';


import {Sale} from '../../interfaces';

interface PresaleCarddProp {
    sale: Sale
}

const currentTime = Date.now();


const PresaleCardd: FC<PresaleCarddProp> = ({sale}) => {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => ( 
                
                Number(sale.startTime) > Date.now() ?  prevProgress :
                Number(sale.endingTime) > Date.now() && prevProgress < 100 ? prevProgress + 1 : prevProgress

                ));

        }, 400);
        return () => {
            clearInterval(timer);
        };
    }, []);
   
    const CountDownComponent = () => {
        return (
            <>
            {
              progress == 100 ?
                <div style={{ fontSize: "16px", fontWeight: 400 }}> Sold Out</div> :
                <Countdown
                    date={Number(sale.startTime) > Date.now() ?  Number(sale.startTime) :   Number(sale.endingTime)}
                    renderer={renderer}
                    />
            }
            </>
            )
        }

    // useEffect(() => {
    //     CountDownComponent();
    // }, [Number(sale.startTime) > Date.now()])


    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
            // Render a completed state
            return <div style={{ fontSize: "16px", fontWeight: 400 }}> The Sale has been ended </div>;
        } else {
            // Render a countdown
            return (
                <div>
                    {
                        Number(sale.startTime) > Date.now() ? 
                        <>
                            <div style={{ fontSize: "16px", fontWeight: 400, marginBottom: "-5px" }}> Presale Starts In </div> 
                            <div style={{ fontSize: "16px", fontWeight: 600 }}> {days}:{hours}:{minutes}:{seconds} </div>
                        </>
                        :
                        <>
                            <div style={{ fontSize: "16px", fontWeight: 400, marginBottom: "-5px" }}> Presale Ends In </div>
                            <div style={{ fontSize: "16px", fontWeight: 600 }}> {days}:{hours}:{minutes}:{seconds} </div>
                        </>

                    }

                    {/* <div style={{ fontSize: "16px", fontWeight: 600 }}> {days}:{hours}:{minutes}:{seconds} </div> */}
                </div>
            )
        }
    };

    const EllipsisText = (props: any) => {
        const { children } = props
        return (
            <div style={{
                fontSize: "9px",
                width: "100%",

            }}>
                {children}
            </div>
        )
    }

    const PendingText = () => {
        return(
            <>
                <Tooltip title="This project is yet to start">
                <Chip
                    variant="filled"
                    sx={{ width: 60, height: 20, bgcolor: "#ffffffea" }}
                    icon={<PendingIcon sx={{ width: 12, height: 12 }} />}
                    label={<EllipsisText> Pending </EllipsisText>}
                    size="small"
                />
                </Tooltip>
            </>
        )
    }

    const SuccessText = () => {
        return (
            <>
            <Tooltip title={`This sale is successful. You can claim your tokens`} >
                <Chip
                    variant="filled"
                    sx={{ width: 80, height: 20, bgcolor: "#00ff9dea" }}
                    icon={<ThumbUpAltOutlinedIcon  sx={{width: 12, height: 12}}/>}
                    label={<EllipsisText> Successful </EllipsisText>}
                    size="small"
                />
                 </Tooltip>
        </> 
        )
    }

    const FailourText = () => {
        return(
            <>
            <Tooltip title={`This sale is failed. You can claim your refund`} >
                <Chip
                    variant="filled"
                    sx={{ width: 80, height: 20, bgcolor: "#ec1e1eb5" }}
                    icon={<ThumbDownOutlinedIcon  sx={{width: 12, height: 12}}/>}
                    label={<EllipsisText> Falied </EllipsisText>}
                    size="small"
                />
                 </Tooltip>
        </>
        )
    }

    const CircularProgressComp = () => {
        return(
            <CircularProgress
            variant="determinate"
            value={Number(sale.startTime) > Date.now() ? 0 : progress}
            thickness={1}
            size={150}
            sx={{ bgcolor: "#e4e4e4", borderRadius: 20, 
            color: "#5272ff" 
        
        }}
        />
        )
    }

    console.log(`OK ${Date.now()} -  ${Number(sale.endingTime)} => ${Date.now() >= Number(sale.endingTime)}`)
    // console.log(`OK ${currentTime} -  ${Number(sale.endingTime)}}`)

    return (
        <Box sx={{ margin: 1, height: 500, borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Card sx={{ border: "0px solid blue", height: "500px", padding: 1, width: "100%", borderRadius: "10px" }}>

                <React.Fragment>

                    <CardContent sx={{ border: "0px solid red", height: "85%", padding: 0 }}>

                        <div style={{ border: "0px solid red", height: "5%" }}>
                            Presale # {sale.id}
                        </div>

                        <Divider sx={{ margin: "5px" }} />

                        <Grid container sx={{ border: "0px solid red", height: "15%", display: "flex" }}>

                            <Grid item xs={2} lg={2.5} sx={{ border: "0px solid red", width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {
                                    sale.image ?
                                    <Avatar sx={{ bgcolor: "#d65555", width: 50, height: 50 }} src={sale.image} /> :
                                    <Avatar sx={{ bgcolor: "#d65555", width: 50, height: 50 }}> {sale.name.slice(0,1)} </Avatar>
                                }
                                
                            </Grid>

                            <Grid item xs={8} lg={4.5} sx={{ border: "0px solid blue", width: "50%" }}>

                                <div
                                    style={{
                                        border: "0px solid black", 
                                        height: "10%",
                                    }}> </div>

                                <div
                                    style={{
                                        border: "0px solid black", 
                                        height: "40%",
                                        display: "flex",
                                        fontSize: "16px", fontWeight: 600
                                    }}> {sale.name} </div>

                                <div style={{
                                        border: "0px solid black", 
                                        height: "35%",
                                        display: "flex",
                                        fontSize: "12px", fontWeight: 400
                                }}>  {sale.symbol} </div>

                                <div style={{
                                    height: "15%",
                                }}>  </div>

                            </Grid>

                            <Grid item xs={2} lg={5} sx={{ border: "0px solid blue", width: "25%", paddingRight: 1 }}>

                                <div style={{border: "0px solid red", display: "flex", justifyContent: "flex-end"}}>
                                    {
                                        sale.typeOfSale === "OpenForAll" && (
                                            <Tooltip title="This sale is open for everyone">
                                            <Chip
                                                variant="filled"
                                                sx={{ width: 80, height: 20, bgcolor: "#00ff9dea" }}
                                                icon={<LockOpenIcon sx={{ width: 12, height: 12 }} />}
                                                label={<EllipsisText> {sale.typeOfSale} </EllipsisText>}
                                                size="small"
                                            />
                                             </Tooltip>
                                        )
                                    }
                                    
                                    {
                                        sale.typeOfSale === "OnlyWhiteListed" && (
                                            <Tooltip title="This sale is open for only white listed participants">
                                            <Chip
                                                variant="filled"
                                                sx={{ width: 95, height: 20, bgcolor: "#f8f551fb" }}
                                                icon={<LockIcon sx={{width: 12, height: 12}}/>}
                                                label={<EllipsisText> {sale.typeOfSale} </EllipsisText>}
                                                size="small"
                                            />
                                             </Tooltip>
                                        )
                                    }
                                    
                                    {
                                        sale.typeOfSale === "OnlyTokenHolders" && (
                                            <Tooltip title={`This sale is open for participants who hold at least ${sale.minimumTokens} Tokens`} >
                                            <Chip
                                                variant="filled"
                                                sx={{ width: 110, height: 20, bgcolor: "#4551fc9d" }}
                                                icon={<LockIcon sx={{width: 12, height: 12}}/>}
                                                label={<EllipsisText> {sale.typeOfSale} </EllipsisText>}
                                                size="small"
                                            />
                                             </Tooltip>
                                        )
                                    }


                                </div>
                                
                                <div style={{border: "0px solid red", display: "flex", justifyContent: "flex-end", marginTop: "3px"}}>

                                </div>

                                
                            </Grid>

                        </Grid>

                        <Divider />

                        <div style={{ border: "0px solid red", padding: "0px", marginTop: "5%", height: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>


                            <Box sx={{ padding: 0, position: 'relative', display: 'inline-flex', border: "0px solid red", }}>
                                
                                <CircularProgressComp />

                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="text.secondary"
                                        sx={{ fontSize: "15px" }}
                                    >

                                    {
                                        Number(sale.startTime) > Date.now() ?
                                        <PendingText />  :
                                        Number(sale.endingTime) < Date.now() && progress < 70 ?
                                        <FailourText />  :
                                        (Number(sale.endingTime) < Date.now()  &&  progress >= 70) || (progress === 100) ?
                                        <SuccessText />  :
                                        <div> {`Sold ${Math.round(progress)}%`} </div> 
                                    
                                    }

                                    </Typography>
                                </Box>
                            </Box>


                        </div>


                        <div style={{ border: "0px solid red", height: "35%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "13px" }}>

                            <div style={{ border: "0px solid red", height: "100%", padding: "30px" }}>

                                <div style={{ border: "0px solid red", }} >
                                    Tokens on Sale: <span style={{ fontSize: "inherit", color: "#5272ff" }}> {`${sale.tokensForSale} ${sale.symbol}`} </span>
                                </div>

                                <div style={{ border: "0px solid red", }} >
                                    Price of 1 {sale.symbol} : <span style={{ fontSize: "inherit", color: "#5272ff" }}> {`${sale.price} BNB`} </span>
                                </div>

                                <div style={{ border: "0px solid red", }} >
                                    Soft Cap: <span style={{ fontSize: "inherit", color: "#5272ff" }}> {`${sale.softCap} ${sale.symbol}`} </span>
                                </div>

                                <div style={{ border: "0px solid red", }} >
                                    Liquidity: <span style={{ fontSize: "inherit", color: "#5272ff" }}> {sale.liquidity} </span>
                                </div>

                            </div>

                        </div>

                        <Divider />

                    </CardContent>


                    <CardActions sx={{ border: "0px solid blue", height: "15%",  padding: 1, margin: 1 }}>

                        <div style={{ border: "0px solid red", width: "10%" }} />

                        <div style={{ 
                            border: "0px solid red", height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <CountDownComponent />
                        </div>

                        <div style={{ border: "0px solid red", width: "10%" }}>
                            <Link to={String(sale.id)} style={{ textDecoration: 'none' }}>
                                <OpenInNewIcon fontSize="small" />
                            </Link>
                        </div>


                    </CardActions>

                </React.Fragment>
            </Card>
        </Box>
    )
}

export default PresaleCardd



