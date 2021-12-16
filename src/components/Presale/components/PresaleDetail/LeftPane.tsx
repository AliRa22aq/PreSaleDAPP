import React, { FC, useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import { DetailContainer, UpdatesContainer, GuideContainer, UpdatesDiv, DiscriptionHeading, ParticipationDetails } from './styles';
import { PaiChartContainer, ParticipationDetailsBody, ParticipationDetailsHeading} from './styles';

import { RulesProps } from './interfaces';
import { Form, Formik, Field } from "formik";
import { TextField } from 'formik-material-ui';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import { TextField as TextF } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import TextareaAutosize from '@mui/material/TextareaAutosize';
import Card from '@mui/material/Card';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//@ts-ignore
import { Chart, registerables, PieController, ArcElement, Legend, Tooltip, Title} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';
import Avatar from '@mui/material/Avatar';

import LinearProgress from '@mui/material/LinearProgress';


import { useParams } from "react-router-dom"; 
import { useSelector } from 'react-redux';
import {Sale} from '../../../store';
import {  setSaleProgress, setStatus } from '../../../store';


type LayoutPosition = 'left' | 'top' | 'right' | 'bottom' | 'center';
type TitlePosition =  "left" | "top" | "right" | "bottom" | undefined;

const LeftPane: FC<RulesProps> = ({ ownerView, saleEnded }) => {


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
                Date.now() > Number(sale.startTime) && Date.now() < Number(sale.endingTime) && prevProgress < 100 ? 
                prevProgress + 1 : prevProgress
                
                ));
                
            }, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);

    Chart.register(...registerables, PieController, ArcElement, Title, Legend, Tooltip );

    const position:LayoutPosition = "bottom";

    const option = {
        radius: "90%",
        cutout: "90",
        plugins: {
            legend: {
                position: position
            },
            title: {
                display: true,
                text: "Tokenomics"
            }
        },
    }

    const data = {
        labels: ['sold', 'remaining', 'liquidity'],
        datasets: [
            {
                label: 'Tokenomics',
                data: [progress*Number(sale.tokensForSale)/100, (100-progress)*Number(sale.tokensForSale)/100, Number(sale.tokensForSale) * Number(sale.liquidity.replace("%", "")) / 100 ],
                backgroundColor: [
                    'rgb(255, 64, 105)',
                    'rgba(89, 241, 102, 0.979)',
                    'rgba(43, 46, 216, 0.979)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 0,
            },
        ],
    };


    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
    };

    const [time, setTime] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    const handleStartingTime = (newValue: Date | null) => {
        if (newValue)
            console.log(newValue?.getTime() / 1000);
    };

    const handleEndingTime = (newValue: Date | null) => {
        if (newValue)
            console.log(newValue?.getTime() / 1000);
    };

    const [logo, setLogo] = useState<any>();

    const handleCapture = (e: any) => {
        const fileReader = new FileReader();
        const name = e.target.accept.includes('image') ? 'images' : 'videos';

        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (e) => {
            
             console.log(JSON.stringify(e?.target?.result))

            if(e && e.target && e.target.result){
                setLogo(e?.target?.result);
            } 
        };
    };

    
    return (
        <div style={{ margin: "0px" }}>

            {/* Doughnut */}
            <DetailContainer>
                <Card variant="outlined">
                    <GuideContainer>
                        <PaiChartContainer style={{
                            border: "0px solid black",
                            width: "100%",
                            height: "100%",
                            marginTop: "10px",
                            marginBottom: "10px"
                        }}>
                            <div style={{position: "relative"}}>
                                <Doughnut data={data} options={option} />
                            <div style={{ position:"absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "12px", fontWeight: 600}}>
                                
                                <div style={{}}>
                                    Sold: {progress*Number(sale.tokensForSale)/100}
                                </div>

                                <div style={{}}>
                                    Remaining: {(100-progress)*Number(sale.tokensForSale)/100}
                                </div>
                            </div>
                            </div>
                        
                        </PaiChartContainer>
                    </GuideContainer>
                </Card>
            </DetailContainer>

                    {/* Doughnut */}
            <DetailContainer>
                <Card variant="outlined">
                    <div style={{margin: "10px", height: "120px", padding: 5, fontSize: "12px", fontWeight: 700}}>

                        <div style={{ margin: "10px"}}> Funds Raised</div>
                        
                        <div style={{ margin: "20px"}}>
                                <LinearProgress variant="determinate" value={progress} sx={{bgcolor: "#ddc9c9"}} />
                        </div>
                        
                        <div> {progress * 50 / 100} BNB / 50 BNB</div>

                    </div>
                </Card>
            </DetailContainer>


            {
                ownerView && (
                    <DetailContainer>

                        <Card variant="outlined" sx={{ marginTop: "10px" }}>

                            <UpdatesContainer>

                                <DiscriptionHeading> Owner's Dashboard </DiscriptionHeading>


                                <UpdatesDiv> {/* Update General Information */}
                                    <Formik
                                        initialValues={{ address: "" }}
                                        // validationSchema={schema1} 
                                        onSubmit={async (values, { setFieldValue }) => {
                                            console.log(values);
                                        }}>
                                        {() => (
                                            <Form>

                                                <Accordion
                                                    expanded={expanded === 'panel0'}
                                                    onChange={handleAccordionChange('panel0')}
                                                    sx={{ border: "0px solid black", }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel0bh-content"
                                                        id="panel0bh-header"
                                                    >
                                                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                                            Update General Information
                                                        </Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails>

                                                        <Grid container sx={{ border: "0px solid black" }}>

                                                            <Grid item xs={2} lg={3} sx={{border: "0px solid black", }}>
                                                                <Avatar sx={{ width: 50, height: 50 }} src={logo ? logo : ""} />
                                                            </Grid>

                                                            <Grid item xs={6} sx={{border: "0px solid black", display: "flex", justifyContent:"flex-start", alignItems: "center"}}>
                                                                <Button variant="contained" component="label" size="small" > 
                                                                    Update Logo <input type="file" onChange={handleCapture} hidden/>
                                                                </Button>
                                                            </Grid>


                                                            <Grid item xs={12} sx={{ margin: "auto", marginTop: 1 }} >
                                                                <Field
                                                                    component={TextField}
                                                                    type="text"
                                                                    name="description"
                                                                    label="Description of Project"
                                                                    fullWidth
                                                                    multiline
                                                                />

                                                            </Grid>


                                                            <Grid item xs={12} sx={{ margin: "auto", marginTop: 0.5 }}>
                                                                <Field
                                                                    component={TextField}
                                                                    type="text"
                                                                    name="discordLink"
                                                                    label="Discord Link"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ margin: "auto", marginTop: 0.5 }}>
                                                                <Field
                                                                    component={TextField}
                                                                    type="text"
                                                                    name="websiteLink"
                                                                    label="Website Link"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ margin: "auto", marginTop: 0.5 }}>
                                                                <Field
                                                                    component={TextField}
                                                                    type="text"
                                                                    name="telegramLink"
                                                                    label="Telegram Link"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ margin: "auto", marginTop: 0.5 }}>
                                                                <Field
                                                                    component={TextField}
                                                                    type="text"
                                                                    name="twitterLink"
                                                                    label="Twitter Link"
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                                
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                type="submit"
                                                                size="small"
                                                                sx={{ margin: "auto", marginTop: 1 }}
                                                                disabled={saleEnded ? true : false}
                                                            >
                                                                <div >White List</div>

                                                            </Button>

                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>

                                            </Form>
                                        )}
                                    </Formik>
                                </UpdatesDiv>



                                <UpdatesDiv> {/* White List Accounts */}
                                    <Formik
                                        initialValues={{ address: "" }}
                                        // validationSchema={schema1} 
                                        onSubmit={async (values, { setFieldValue }) => {
                                            console.log(values);
                                        }}>
                                        {() => (
                                            <Form>

                                                <Accordion
                                                    expanded={expanded === 'panel1'}
                                                    onChange={handleAccordionChange('panel1')}
                                                    sx={{ border: "0px solid black", }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                        id="panel1bh-header"
                                                    >
                                                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                                            White List Accounts
                                                        </Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails>
                                                        <Grid container sx={{ border: "0px solid black" }}>
                                                            <Grid item xs={12} sx={{ margin: 0 }} >
                                                                <Field
                                                                    component={TextareaAutosize}
                                                                    type="text"
                                                                    name="address"
                                                                    label="Accounts"
                                                                    placeholder="In form of an array e.g.['0x90ee3Cf59FcDe2FE11838b9075Ea4681462362F1','0x8dd92dd186f05e3e9f1844cd9047617adad8a66d','0x8dd92dd186f05e3e9f1844cd9047617adad8a66d']"
                                                                    fullWidth
                                                                    multiline
                                                                    style={{ width: "100%", minHeight: "50px" }}

                                                                />
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    type="submit"
                                                                    size="small"
                                                                    sx={{ margin: "auto", marginTop: 1 }}
                                                                    disabled={saleEnded ? true : false}
                                                                >
                                                                    <div >White List</div>
                                                                </Button>

                                                            </Grid>
                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>

                                            </Form>
                                        )}
                                    </Formik>
                                </UpdatesDiv>

                                <UpdatesDiv> {/* White List Accounts */}
                                    <Formik
                                        initialValues={{ address: "" }}
                                        // validationSchema={schema1} 
                                        onSubmit={async (values, { setFieldValue }) => {
                                            console.log(values);
                                        }}>
                                        {() => (
                                            <Form>

                                                <Accordion
                                                    expanded={expanded === 'panel2'}
                                                    onChange={handleAccordionChange('panel2')}
                                                    sx={{ border: "0px solid black", }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel2bh-content"
                                                        id="panel2bh-header"
                                                    >
                                                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                                            Update Participation Criteria
                                                        </Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails>


                                                        <Grid container spacing={0} sx={{ border: "0px solid black" }}>

                                                            <Grid item xs={12} sx={{ marginTop: 0.5 }} >
                                                                <Field
                                                                    component={TextField}
                                                                    type="number"
                                                                    name="priceOfEachToken"
                                                                    label="Price of Token in BNB (e.g. 0.2 BNB)"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ marginTop: 0.5 }} >
                                                                <Field
                                                                    component={TextField}
                                                                    type="number"
                                                                    name="minTokenForParticipation"
                                                                    label="Minimum Tokens for Participation"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ marginTop: 0.5 }} >
                                                                <Field
                                                                    component={TextField}
                                                                    type="number"
                                                                    name="address"
                                                                    label="Min Token Request"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ marginTop: 0.5 }} >
                                                                <Field
                                                                    component={TextField}
                                                                    type="number"
                                                                    name="address"
                                                                    label="Max Token Request"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                type="submit"
                                                                size="small"
                                                                sx={{ margin: "auto", marginTop: 1 }}
                                                                disabled={saleEnded ? true : false}
                                                            >
                                                                <div >Update</div>

                                                            </Button>

                                                        </Grid>


                                                    </AccordionDetails>
                                                </Accordion>

                                            </Form>
                                        )}
                                    </Formik>
                                </UpdatesDiv>

                                <UpdatesDiv> {/* White List Accounts */}
                                    <Formik
                                        initialValues={{ address: "" }}
                                        // validationSchema={schema1} 
                                        onSubmit={async (values, { setFieldValue }) => {
                                            console.log(values);
                                        }}>
                                        {() => (
                                            <Form>

                                                <Accordion
                                                    expanded={expanded === 'panel3'}
                                                    onChange={handleAccordionChange('panel3')}
                                                    sx={{ border: "0px solid black", }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel3bh-content"
                                                        id="panel3bh-header"
                                                    >
                                                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                                            Update Project Time
                                                        </Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails>

                                                        <Grid container sx={{ border: "0px solid black" }}>
                                                            <Grid item xs={12} sx={{ marginTop: 0 }} >
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            label='Starting time of crowd sale'
                                                                            value={time}
                                                                            onChange={handleStartingTime}
                                                                            renderInput={(params) => <TextF {...params} />}
                                                                        />
                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </Grid>

                                                            <Grid item xs={12} sx={{ marginTop: 1 }} >
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            label='Starting time of crowd sale'
                                                                            value={time}
                                                                            onChange={handleEndingTime}
                                                                            renderInput={(params) => <TextF {...params} />}
                                                                        />
                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </Grid>

                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                type="submit"
                                                                size="small"
                                                                sx={{ margin: "auto", marginTop: 1 }}
                                                                disabled={saleEnded ? true : false}
                                                            >
                                                                <div >Update</div>

                                                            </Button>
                                                        </Grid>

                                                    </AccordionDetails>
                                                </Accordion>

                                            </Form>
                                        )}
                                    </Formik>
                                </UpdatesDiv>

                                <UpdatesDiv> {/* White List Accounts */}
                                    <Formik
                                        initialValues={{ address: "" }}
                                        // validationSchema={schema1} 
                                        onSubmit={async (values, { setFieldValue }) => {
                                            console.log(values);
                                        }}>
                                        {() => (
                                            <Form>

                                                <Accordion
                                                    expanded={expanded === 'panel4'}
                                                    onChange={handleAccordionChange('panel4')}
                                                    sx={{ border: "0px solid black", }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel4bh-content"
                                                        id="panel4bh-header"
                                                    >
                                                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                                                    Update Criteria Token
                                                        </Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails>

                                                        <Grid container sx={{ border: "0px solid black" }}>
                                                            <Grid item xs={12} sx={{ marginTop: 0 }} >
                                                                <Field
                                                                    component={TextField}
                                                                    type="text"
                                                                    name="address"
                                                                    label="Account"
                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                type="submit"
                                                                size="small"
                                                                sx={{ margin: "auto", marginTop: 1 }}
                                                                disabled={saleEnded ? true : false}
                                                            >
                                                                <div >Update</div>

                                                            </Button>
                                                        </Grid>

                                                    </AccordionDetails>
                                                </Accordion>

                                            </Form>
                                        )}
                                    </Formik>
                                </UpdatesDiv>

                            </UpdatesContainer>
                        </Card>
                    </DetailContainer>
                )

            }

        </div>
    )
}

export default LeftPane
