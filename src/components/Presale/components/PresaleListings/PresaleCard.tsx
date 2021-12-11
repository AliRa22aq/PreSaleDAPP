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
import Tooltip from '@mui/material/Tooltip';


interface CardPros {
    id: number
}

const PresaleCardd: FC<CardPros> = ({ id }) => {


    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 2000);
        return () => {
            clearInterval(timer);
        };
    }, []);


    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
            // Render a completed state
            return <div style={{ fontSize: "20px", fontWeight: 700 }}> The Sale has been ended </div>;
        } else {
            // Render a countdown
            return (
                <div>
                    <div style={{ fontSize: "16px", fontWeight: 400, marginBottom: "-5px" }}> Presale Ends in </div>
                    <div style={{ fontSize: "16px", fontWeight: 600 }}> {days}:{hours}:{minutes}:{seconds} </div>
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



    return (
        <Box sx={{ margin: 1, height: 500, borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Card sx={{ border: "0px solid blue", height: "500px", padding: 1, width: "100%", borderRadius: "10px" }}>

                <React.Fragment>

                    <CardContent sx={{ border: "0px solid red", height: "85%", padding: 0 }}>

                        <div style={{ border: "0px solid red", height: "5%" }}>
                            Presale # {id}
                        </div>

                        <Divider sx={{ margin: "5px" }} />

                        <Grid container sx={{ border: "0px solid red", height: "15%", display: "flex" }}>

                            <Grid item xs={1.5} lg={2.5} sx={{ border: "0px solid red", width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Avatar sx={{ bgcolor: "#d65555", width: 50, height: 50 }}>A</Avatar>
                            </Grid>

                            <Grid item xs={8.5} lg={5.5} sx={{ border: "0px solid red", width: "50%" }}>

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
                                        fontSize: "16px", fontWeight: 600
                                    }}> Ali Coin </div>

                                <div style={{
                                    // border: "1px solid blue",
                                    height: "35%",
                                    display: "flex",
                                    fontSize: "12px", fontWeight: 400
                                }}>  ALIC </div>

                                <div style={{
                                    height: "15%",
                                }}>  </div>

                            </Grid>

                            <Grid item xs={2} lg={4} sx={{ border: "0px solid red", width: "25%", alignContent: "flex-end" }}>
                                <Tooltip title="This project is open for everyone">
                                    <Chip
                                        variant="filled"
                                        // color="success"
                                        sx={{ width: 80, height: 20, bgcolor: "#00ff9dea" }}
                                        icon={<LockOpenIcon sx={{ width: 12, height: 12 }} />}
                                        label={<EllipsisText> Open for all</EllipsisText>}
                                        size="small"
                                    />
                                </Tooltip>

                                {/* <Chip 
                                            variant="filled" 
                                            color="info"
                                            sx={{ width: 95, height: 20}}
                                            icon={<LockIcon sx={{width: 10, height: 10}}/>}
                                            label={<EllipsisText> Only Whitelisted </EllipsisText>}
                                            size="small"
                                            /> */}

                                {/* <Chip 
                                            variant="filled" 
                                            color="info"
                                            sx={{ width: 110, height: 20}}
                                            icon={<LockIcon sx={{width: 10, height: 10}}/>}
                                            label={<EllipsisText> Only Token holders </EllipsisText>}
                                            size="small"
                                            /> */}

                            </Grid>

                        </Grid>

                        <Divider />

                        <div style={{ border: "0px solid red", padding: "0px", marginTop: "5%", height: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>


                            <Box sx={{ padding: 0, position: 'relative', display: 'inline-flex', border: "0px solid red", }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    thickness={5}
                                    size={150}
                                    sx={{ bgcolor: "#e4e4e4", borderRadius: 20, color: "#5272ff" }}
                                />
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

                                        {`Sold ${Math.round(progress)}%`}
                                        {/* <Chip variant="filled" label="Pending" size="small" /> */}

                                    </Typography>
                                </Box>
                            </Box>


                        </div>


                        <div style={{ border: "0px solid red", height: "35%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "13px" }}>

                            <div style={{ border: "0px solid red", height: "100%", padding: "30px" }}>

                                <div style={{ border: "0px solid red", }} >
                                    Tokens on Sale: <span style={{ fontSize: "inherit", color: "#5272ff" }}> 10,000 ALIC </span>
                                </div>

                                <div style={{ border: "0px solid red", }} >
                                    Price of 1 ALIC : <span style={{ fontSize: "inherit", color: "#5272ff" }}> 0.02 BNB </span>
                                </div>

                                <div style={{ border: "0px solid red", }} >
                                    Soft Cap: <span style={{ fontSize: "inherit", color: "#5272ff" }}> 8,000 ALIC </span>
                                </div>

                                <div style={{ border: "0px solid red", }} >
                                    Liquidity: <span style={{ fontSize: "inherit", color: "#5272ff" }}> 70% </span>
                                </div>

                            </div>

                        </div>

                        <Divider />

                    </CardContent>


                    <CardActions sx={{ border: "0px solid blue", height: "15%", padding: 1, margin: 1 }}>

                        <div style={{ border: "0px solid red", width: "10%" }} />

                        <div style={{ border: "0px solid red", height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Countdown
                                date={Date.now() + 50000000}
                                renderer={renderer}
                            />
                        </div>

                        <div style={{ border: "0px solid red", width: "10%" }}>
                            <Link to={String(id)} style={{ textDecoration: 'none' }}>
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



