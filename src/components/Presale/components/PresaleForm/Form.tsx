import React, { useState } from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Form, Formik, Field } from "formik";
import { TextField } from 'formik-material-ui';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { RootContainer, StyledButton, FormSubHeading, FromContainer, FormHeader, FormBody } from '../../style';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import Stack from '@mui/material/Stack';
import {TextField as TextF} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import TimePicker from '@mui/lab/TimePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
// import DesktopDatePicker from '@mui/lab/DesktopDatePicker';


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


import Divider from '@mui/material/Divider';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Avatar from '@mui/material/Avatar';



import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


function InputForm() {
    
    const [seleted, setSellected] = useState(0);
    
    const handleSelect = (event: any) => {
      console.log(event.target.value);
      setSellected(event.target.value);
    };

    const [expanded, setExpanded] = React.useState<string | false>("panel1");

    const handleAccordionChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
      };
  

    const [time, setTime] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54')
    );

    const handleStartingTime = (newValue: Date | null) => {
        if(newValue)
        console.log(newValue?.getTime() / 1000);
    };

    const handleEndingTime = (newValue: Date | null) => {
        if(newValue)
        console.log(newValue?.getTime() / 1000);
    };


    const [logo, setLogo] = useState<any>("https://www.rd.com/wp-content/uploads/2018/02/25_Hilarious-Photos-that-Will-Get-You-Through-the-Week_280228817_Doty911.jpg?fit=640,800");

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


    const [activeStep, setActiveStep] = useState(0);
    const [submit, setSubmit] = useState(false);

    const steps = ['Token Information', 'Sales Information', 'Criteria Information', 'General Information'];

    const handleNextStep = (window: string, step: number) => {
            setExpanded(window)
            setActiveStep(step)
    }

    const handlePreveousStep = (window: string, step: number) => {
        setExpanded(window)
        setActiveStep(step)
}

    const handleSubmit = (window: string, step: number) => {
        setExpanded(window)
        setActiveStep(step)
        setSubmit(true)

    }

    return (
        
        <Formik initialValues={{ address: '' }}
        // validationSchema={schema1} 
        onSubmit={async (values, { setFieldValue }) => {
            console.log(values);
                }}>

                {() => (
                    <FromContainer>
                    <Form>
                    <div style={{margin: "5px"}}>

                        <Box sx={{ width: '100%', marginBottom: "10px" }}>
                            <Stepper activeStep={activeStep} alternativeLabel >
                                {steps.map((label) => (
                                    <Step key={label} >
                                        <StepLabel> {label} </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                            Token Information
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Provide the token address you want to put on crowdsale</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Grid container>
                                    <Grid item xs={12} sx={{ margin: 0 }} >
                                        <Field
                                            component={TextField}
                                            type="text"
                                            name="address"
                                            label="Conrtact Address"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{ margin: 1, display:"flex", justifyContent: "flex-end" }} >
                                        <Button size="small" variant="contained" onClick={() => handleNextStep("panel2", 1)}> Next </Button>
                                    </Grid>

                                </Grid>
                            </AccordionDetails>
                        </Accordion>


                        <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>

                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                            >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Crowd Sale Information</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                Provide information about crowdsale
                            </Typography>
                            </AccordionSummary>


                            <AccordionDetails>

                            <Grid container spacing={1}>

                                <Grid item xs={3} sx={{ margin: 0 }} >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={seleted}
                                            label="Age"
                                            onChange={handleSelect}
                                        >
                                            <MenuItem value={0}>Open For all</MenuItem>
                                            <MenuItem value={1}>Only White Listed  </MenuItem>
                                            <MenuItem value={2}>Only Token Holders</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={9} sx={{ margin: 0 }} >
                                    {
                                    seleted == 2 ?
                                        <Field
                                            component={TextField}
                                            type="text"
                                            name="address"
                                            label="Criteria Conrtact Address"
                                            fullWidth
                                        />
                                        :
                                        null
                                    }
                                    </Grid>

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="TokensForSale"
                                        label="Tokens For sale"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="TokensForLiquidity"
                                        label="Additional tokens for Liquidity pool in % "
                                        fullWidth
                                    />
                                </Grid>


                                <Grid item xs={12} sx={{ margin: 1, display:"flex", justifyContent: "space-between" }} >
                                        <Button size="small" variant="contained" onClick={() => handlePreveousStep("panel1",0)}> Preveous </Button>
                                        <Button size="small" variant="contained" onClick={() => handleNextStep('panel3', 2)}> Next </Button>
                                </Grid>

                            </Grid>

                            </AccordionDetails>

                        </Accordion>

                        <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Participation Criteria
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Set criteria for partipipants</Typography>
                            </AccordionSummary>

                            <AccordionDetails>

                            <Grid container spacing={1}>

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="PriceOfToken"
                                        label="Price of each Token "
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="MinTokensForParticipation"
                                        label="Minimum Tokens For Participation (Only TokenHolder case) "
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="minReqTokens"
                                        label="Minimum requested Tokens"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="maxReqTokens"
                                        label="Maximum requested Tokens"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6} sx={{ margin: 0 }} >
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

                                <Grid item xs={6} sx={{ margin: 0 }} >
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

                                <Grid item xs={6} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="number"
                                        name="softCap"
                                        label="Soft cap for success of the project"
                                        fullWidth
                                    />
                                </Grid>


                                <Grid item xs={12} sx={{ margin: 1, display:"flex", justifyContent: "space-between" }} >
                                        <Button size="small" variant="contained" onClick={() => handlePreveousStep("panel2", 1)}> Preveous </Button>
                                        <Button size="small" variant="contained" onClick={() => handleNextStep('panel4', 3)}> Next </Button>
                                </Grid>

                            </Grid>

                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    General Information
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}> Information about your team and your social presence </Typography>
                            </AccordionSummary>

                            <AccordionDetails>

                            <Grid container spacing={1}>

                                    <Grid item xs={3} lg={1} sx={{border: "0px solid black"}}>
                                        <Avatar sx={{ width: 70, height: 70 }} src={logo ? logo : ""} />
                                    </Grid>

                                    <Grid item xs={9} sx={{border: "0px solid black", display: "flex", justifyContent:"flex-start", alignItems: "center"}}>
                                        <Button variant="contained" component="label" > 
                                            Upload Logo <input type="file" onChange={handleCapture} hidden/>
                                        </Button>
                                    </Grid>


                                <Grid item xs={12} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="description"
                                        label="Description of Project"
                                        fullWidth
                                        multiline
                                    />

                                </Grid>

                                <Grid item xs={12} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="websiteLink"
                                        label="Website Link"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="telegramLink"
                                        label="Telegram Link"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ margin: 0 }} >
                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="twitterLink"
                                        label="Twitter Link"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ margin: 1, display:"flex", justifyContent: "space-between" }} >
                                        <Button size="small"  variant="contained" onClick={() => handlePreveousStep("panel3", 2)}> Preveous </Button>
                                        <Button size="small"  variant="contained" onClick={() => handleSubmit("done", 4)}> Submit </Button>
                                </Grid>


                            </Grid>


                            </AccordionDetails>
                        </Accordion>


                    </div>

                    <Grid container spacing={0} >

                    {
                      submit ? 
                      <>
                        <Card sx={{ border: "0px solid black", margin: "5px"}}>
                            <Grid item xs={12} sx={{ border: "0px solid black",  padding: "0px", }}>

                                    <div style={{border: "0px solid black", paddingTop: "10px", fontSize: "20px", fontWeight: 600, display: "flex", justifyContent:"center"}}> Summary </div>
                                    
                                    <div style={{border: "0px solid black", margin: "10px", fontSize: "16px"}}>

                                            <Grid item xs={12} sx={{paddingLeft: "10px", fontSize: "16px",  fontWeight: 600}} > Token's Data </Grid>

                                            <Grid container spacing={1} sx={{padding: "10px", fontSize: "14px",  fontWeight: 600}}>  
    
                                                <Grid item xs={12}>
                                                    Token: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 0x000000000000000000000000000000000000000000000</span>
                                                </Grid>

                                                <Grid item xs={2.4}>
                                                    Name: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> Ali Coin</span>
                                                </Grid>

                                                <Grid item xs={2.4}>
                                                    Symbol: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> ALIC</span>
                                                </Grid>
                                                
                                                <Grid item xs={2.4}>
                                                    Decimal: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 18</span>
                                                </Grid>

                                                <Grid item xs={2.4}>
                                                    Total Supply: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 1,000,000 </span>
                                                </Grid>

                                                <Grid item xs={2.4}>
                                                    You hold: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 50,000 </span>
                                                </Grid>
                                            </Grid>

                                    </div>

                                    <Divider sx={{margin: "10px 20px 10px 20px" }}/>

                                    <div style={{border: "0px solid black", margin: "10px", fontSize: "16px"}}>

                                            <Grid item xs={12} sx={{paddingLeft: "10px", fontSize: "16px",  fontWeight: 600}} > Sale's Data </Grid>

                                            <Grid container spacing={1} sx={{padding: "10px", fontSize: "14px",  fontWeight: 600}}>  
    
                                                <Grid item xs={12}>
                                                    Type of sale: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> Open / Only White listed / Only Token Holders </span>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Criteria Conrtact Address: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 0x000000000000000000000000000000000000000000000 </span>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    Tokens for sale: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 10,000 </span>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    Tokens for Liquidity: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 70% (7,000)</span>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    Total tokens to start project: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 17,000 </span>
                                                </Grid>
                                            </Grid>

                                    </div>

                                    <Divider sx={{margin: "10px 20px 10px 20px"}}/>

                                    <div style={{border: "0px solid black", margin: "10px", fontSize: "16px"}}>

                                            <Grid item xs={12} sx={{paddingLeft: "10px", fontSize: "16px",  fontWeight: 600}} > Participation Criteria </Grid>

                                            <Grid container spacing={1} sx={{padding: "10px", fontSize: "14px",  fontWeight: 600}}>  

                                                <Grid item xs={6}>
                                                    Price of each Token: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 0.02 BNB </span>
                                                </Grid>
                                                
                                                <Grid item xs={6}>
                                                    Soft Cap: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 8,000 </span>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Minimum Tokens For Participation (Only TokenHolder case): <span style={{margin: "10px", fontSize: "inherit", color: "#5272ff"}}> 500 PICNIC </span>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    Minimum requested Tokens: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 100 (contribution: 2BNB) </span>
                                                </Grid>

                                                <Grid item xs={6}>
                                                     Maximum requested Tokens: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 10,000 (contribution: 200BNB) </span>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    Start time: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 14 Auguest 2021, 15 00 (GMT) </span>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    Ending time: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 14 Auguest 2021, 15 00 (GMT) </span>
                                                </Grid>

                                            </Grid>

                                    </div>

                                    <Divider sx={{margin: "10px 20px 10px 20px"}}/>

                                    <div style={{border: "0px solid black", margin: "10px", fontSize: "16px"}}>

                                            <div style={{marginBottom: "-50px", marginRight: "20px", border: "0px solid black", display: "flex", justifyContent: "flex-end"}}>
                                                <Avatar sx={{ width: 60, height: 60 , right: "0px" }} src={logo ? logo : ""}/>
                                            </div>
                                    
                                            <Grid item xs={12} sx={{border: "0px solid black", paddingLeft: "10px", fontSize: "16px",  fontWeight: 600}} > Additional </Grid>
                                    
                                            <Grid container spacing={1} sx={{padding: "10px", fontSize: "14px",  fontWeight: 600}}>  

                                                <Grid item xs={12}>
                                                    Descriotion: 
                                                    <div style={{marginLeft: "10px", fontSize: "14px",  fontWeight: 500, color: "#5272ff"}}> 
                                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                                                        The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, 
                                                        content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as 
                                                        their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have 
                                                        evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).                                                    
                                                    </div> 
                                                </Grid>


                                                <Grid item xs={12}>
                                                    Website Link: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 
                                                        <a style={{fontSize: "inherit", fontWeight:"inherit", color: "inherit" }} href="https://www.google.com" target="_blank"> www.google.com </a> 
                                                    </span>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Telegram Link: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 
                                                        <a style={{fontSize: "inherit", fontWeight:"inherit", color: "inherit" }} href="https://www.telegram.com" target="_blank"> www.telegram.com </a> 
                                                    </span>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Twitter Link: <span style={{margin: "0px", fontSize: "inherit", color: "#5272ff"}}> 
                                                        <a style={{fontSize: "inherit", fontWeight:"inherit", color: "inherit" }} href="https://www.twitter.com" target="_blank"> www.twitter.com </a> 
                                                    </span>
                                                </Grid>
                                            </Grid>

                                    </div>

                            </Grid>
                        </Card>

                        <Grid item xs={12} 
                        sx={{ border: process.env.REACT_APP_BORDER, display: "flex", justifyContent:"center", alignItems: "center", alignSelf: "center"}}>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                className="form-button"
                                size="small"
                                sx={{ margin: 2}}
                                // disabled = {expanded === "done" ? false: true}

                            >
                                <div >Approve Tokens</div>

                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                                className="form-button"
                                sx={{ margin: 2}}
                                // disabled = {expanded === "done" ? false: true}
                            >
                                <div >Start Presale</div>

                            </Button>

                        </Grid>

                    </>
                    :
                    null
                    }   

                    </Grid>
                </Form>
                    </FromContainer>
                )}

            </Formik>
    )
}

export default InputForm
