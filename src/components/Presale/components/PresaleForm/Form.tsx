import React, { useState, useEffect } from 'react'
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
import { TextField as TextF } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

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

import { useDispatch, useSelector } from 'react-redux';
import { setApprovedTokens, setGeneralInfo, GeneralInfo, setFormcontractInfo, ContractInfo, setSaleInfo, SaleInfo, setParticipationCriteria, ParticipationCriteria } from '../../../store';
import axios from "axios";

const Web3 = require("web3");

// import Alert from '@mui/material/Alert';

// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';


// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//     props,
//     ref,
//   ) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//   });


// let abi: any;

function InputForm() {

    web3 = new Web3(window.ethereum);
    
    const dispatch = useDispatch();
    const { formData, presaleData, userAddress, networkID } = useSelector((state: any) => state)

    console.log("formData ", formData)

    const [saleType, setSaleType] = useState(0);
    const handleSelect = (event: any) => {
        // console.log(event.target.value);
        setSaleType(event.target.value);
    };

    const [expanded, setExpanded] = React.useState<string | false>("panel1");

    const handleAccordionChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const [times, setTimes] = useState<{ startingTime: number, endingTime: number }>({
        startingTime: Math.floor(Date.now()) + 15 * 60 * 1000,
        endingTime: Math.floor(Date.now()) + 24 * 60 * 60 * 1000

    });

    const handleStartingTime = (newValue: number | null) => {
        console.log("handleStartingTime", newValue)

        if (newValue) {
            // console.log(newValue?.getTime() / 1000);
            setTimes({ startingTime: newValue, endingTime: times.endingTime })
        }

    };

    const handleEndingTime = (newValue: number | null) => {
        console.log("handleEndingTime", newValue)

        if (newValue) {
            // console.log(newValue?.getTime() / 1000);
            setTimes({ startingTime: times.startingTime, endingTime: newValue })
        }

    };


    const [logo, setLogo] = useState<any>("https://www.rd.com/wp-content/uploads/2018/02/25_Hilarious-Photos-that-Will-Get-You-Through-the-Week_280228817_Doty911.jpg?fit=640,800");

    const handleCapture = (e: any) => {
        const fileReader = new FileReader();
        const name = e.target.accept.includes('image') ? 'images' : 'videos';

        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (e) => {

            // console.log(JSON.stringify(e?.target?.result))

            if (e && e.target && e.target.result) {
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

    const [contractAdd, setContractAdd] = useState("")

    const [tokenInfo, setTokenInfo] = useState({
        loading: false,
        error: false
    })

    const [tokenomincs, setTokenomics] = useState({
        tokensForSale: 10000,
        tokensForLiquidity: 70,
        softCap: 5000
    })

    const handleTokenomics = (e: any, type: string) => {
        if (type === "tokensForSale") {
            setTokenomics({ tokensForSale: e, tokensForLiquidity: tokenomincs.tokensForLiquidity, softCap: tokenomincs.tokensForSale / 2 })
        } else if (type === "tokensForLiquidity") {
            setTokenomics({ tokensForSale: tokenomincs.tokensForSale, tokensForLiquidity: e, softCap: tokenomincs.tokensForSale / 2 });
        }
    }


    // Import Functions 

    const fethcContractInfo = async (address: any) => {
        console.log("error fethcContractInfo start")
        setTokenInfo({ loading: true, error: false })

        setContractAdd(address)

        // let web3: any;
        let res: any;

        try {

            if (networkID === 56) {
                res = await axios.get(`https://api.bscscan.com/api?module=contract&action=getabi&address=${address}&apikey=NP3ZXMF51W5G48FMV9T5GGC1K67YV5UEXC`)
            }
            else if (networkID === 97) {
                res = await axios.get(`https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${address}&apikey=NP3ZXMF51W5G48FMV9T5GGC1K67YV5UEXC`)
            }

        }
        catch (e) {
            console.log("err")
            setTokenInfo({ loading: false, error: true })
            throw ("Unable to fetch this token data")
        }


        console.log(res.data)

        // abi = JSON.parse(res.data.result);

        let Contract: any;
        try {

            // web3 = new Web3(window.ethereum);

            if (networkID === 56) {
                web3 = new Web3(new Web3.providers.HttpProvider(`https://bsc-dataseed.binance.org/`)) 
                Contract = await new web3.eth.Contract(JSON.parse(res.data.result), address);
            }
            else if (networkID === 97) {
                web3 = new Web3(new Web3.providers.HttpProvider(`https://data-seed-prebsc-1-s1.binance.org:8545/`))   
                Contract = await new web3.eth.Contract(JSON.parse(res.data.result), address);
            }

        }
        catch (err) {
            console.log("err")
            setTokenInfo({ loading: false, error: true })
            throw ("Unable to fetch this token data")
        }

        if (!Contract) {
            return;
        }


        const symbol = await Contract.methods.symbol().call();
        const totalSupply = await Contract.methods.totalSupply().call();
        const decimals = await Contract.methods.decimals().call();
        const balanceOf = await Contract.methods.balanceOf(userAddress).call();
        const name = await Contract.methods.name().call();

        // const allownce = await Contract.methods.allowance(userAddress, "0x468C63e7c71CC54e7D7481916214222c6Ac24C48").call()
        // const allownce = await Contract.methods.allowance(userAddress, "0x468C63e7c71CC54e7D7481916214222c6Ac24C48").call()

        // await Contract.methods.approve("0x468C63e7c71CC54e7D7481916214222c6Ac24C48", "17000").send({ from: userAddress });

        // console.log("allownce ", allownce)

        const contractInfo: ContractInfo = {
            address: address,
            methods: Contract.methods,
            name: name,
            symbol: symbol,
            decimal: decimals,
            totalSupply: totalSupply,
            youhold: balanceOf
        }

        dispatch(setFormcontractInfo(contractInfo))

        setTokenInfo({ loading: false, error: false })

        // console.log("error fethcContractInfo ends")


    }

    const approveTokens = async () => {

        const allownce = await formData.contractInfo.methods.allowance(userAddress, presaleData.contractAddress).call()
        console.log(allownce);
        dispatch(setApprovedTokens(Number(allownce)))

        if (Number(allownce) < formData.saleInfo.tokenRequired) {
            try {
                await formData.contractInfo.methods.approve(presaleData.contractAddress, String(formData.saleInfo.tokenRequired)).send({ from: userAddress })
                    .on("confirmation", async (confirmationNumber: number, receipt: any) => {
                        if (confirmationNumber === 1) {
                            console.log(confirmationNumber)
                            console.log(receipt)
                            const allownce = await formData.contractInfo.methods.allowance(userAddress, presaleData.contractAddress).call()
                            console.log(allownce);
                            dispatch(setApprovedTokens(Number(allownce)))
                            alert('success');
                        }
                    })
                    .on("error", async (error: any) => {
                        console.log(error)
                        dispatch(setApprovedTokens(Number(allownce)))
                        alert('error');
                    })
            }
            catch (e) {
                console.log(e)
            }

        } else {
            alert('success');
        }




    }

    const submitPresale = async () => {
        const web3 = new Web3(window.ethereum);
        // alert("submitPresale ")

        // const presaleContract = "0x468C63e7c71CC54e7D7481916214222c6Ac24C48";
        console.log(presaleData.contractAddress)
        console.log(presaleData.methods)

        // const allownce = await formData.contractInfo.methods.allowance(userAddress, "0x468C63e7c71CC54e7D7481916214222c6Ac24C48").call()

        const type = saleType;
        const BEP20Token = formData.contractInfo.address;
        const criteriaToken = type == 2 ? formData.saleInfo.criteriaAddress : formData.contractInfo.address;
        const liquidity = formData.saleInfo.tokensForLiquidity;
        const tokenForSale = formData.saleInfo.tokensForSale;
        const price = formData.participationCriteria.priceOfToken;
        const criteriaTokenReq = formData.participationCriteria.minTokensForParticipation;
        const startingTime = Math.floor(formData.participationCriteria.startingTime / 1000);
        const endingTime = Math.floor(formData.participationCriteria.endingTime / 1000);

        const minReq = formData.participationCriteria.minReqTokens;
        const maxReq = formData.participationCriteria.maxReqTokens;
        const softLimit = formData.participationCriteria.softCap;


        console.log(
            type,
            BEP20Token,
            criteriaToken, liquidity, tokenForSale, price, criteriaTokenReq,
            Math.floor(startingTime / 1000),
            Math.floor(endingTime / 1000),
            minReq, maxReq, softLimit)

        // type, erc20Address, erc20Address, 70, 10000, 100, 250, [now + 15*60+5, now + 24*60*60+5] ,[500, 2000], 7500, { from: user1, value: 100}

        await presaleData.methods.setPresale(
            type,
            BEP20Token,
            criteriaToken,
            liquidity,
            tokenForSale,
            web3.utils.toWei(String(price), "ether"),
            criteriaTokenReq,
            [startingTime, endingTime],
            [minReq, maxReq],
            softLimit

        ).send({ from: userAddress })
            .on("confirmation", async (confirmationNumber: number, receipt: any) => {
                if (confirmationNumber === 1) {
                    console.log(confirmationNumber)
                    console.log(receipt)
                    alert("Successful")
                }
            })


    }

    // On entry to this page
    useEffect(() => {
        setContractAdd("")
    }, [])


    // const { enqueueSnackbar } = useSnackbar();

    // const handleClick = () => {
    //   enqueueSnackbar('I love snacks.');
    // };

    // const handleClickVariant = (variant: VariantType) => () => {
    //   // variant could be success, error, warning, info, or default
    //   enqueueSnackbar('This is a success message!', { variant });
    // };



    // const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false);
    // const [openFailourSnack, setOpenFailourSnack] = React.useState(false);

    // const handleClickSnack = (type: "success"|"failour") => {
    //     if(type === "success"){
    //         setOpenSuccessSnack(true);
    //     }
    //     else if (type === "failour"){
    //         setOpenFailourSnack(true)
    //     }
    // };

    // const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
    //   if (reason === 'clickaway') {
    //     return;
    //   }
    //   setOpenSuccessSnack(false);
    // };



    return (
        <div>

            <div style={{ padding: "5px" }}>

                <Box sx={{ width: '100%', marginBottom: "10px" }}>
                    <Stepper activeStep={activeStep} alternativeLabel >
                        {steps.map((label) => (
                            <Step key={label} >
                                <StepLabel> {label} </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Formik
                    initialValues={{ address: '' }}
                    // validationSchema={schema1} 
                    onSubmit={async (values, { setFieldValue }) => {
                        // console.log(values.address);
                    }}>

                    {() => (

                        <FromContainer>
                            <Form>
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
                                        <Grid container sx={{ padding: 0 }}>


                                            <Grid item xs={12} sx={{ border: "0px solid black", padding: 1 }} >
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    name="address"
                                                    label="Conrtact Address"
                                                    fullWidth
                                                    value={contractAdd}
                                                    onChange={(e: any) => fethcContractInfo(e.target.value)}
                                                />
                                            </Grid>

                                            {
                                                contractAdd && tokenInfo.error ?
                                                    <Grid item xs={12} sx={{ border: "0px solid black", padding: 1, fontSize: "16px" }}>
                                                        Not A BEP20 Token or not available on Chian {networkID}
                                                    </Grid> :
                                                    contractAdd && tokenInfo.loading ?
                                                        <Grid item xs={12} sx={{ border: "0px solid black", width: "100%", display: "flex", justifyContent: "center" }} >
                                                            <CircularProgress />
                                                        </Grid> :
                                                        contractAdd && formData?.contractInfo?.name ?
                                                            <Grid item xs={12} sx={{ border: "0px solid black", padding: 1, fontSize: "16px" }} >
                                                                <div> Name: {formData.contractInfo.name}</div>
                                                                <div> Symbol: {formData.contractInfo?.symbol}</div>
                                                                <div> Decimal: {formData.contractInfo?.decimal}</div>
                                                                <div> Total Supply: {formData.contractInfo?.totalSupply}</div>
                                                            </Grid>
                                                            :
                                                            <>
                                                                {
                                                                    networkID === 56 ?
                                                                        <div>
                                                                            For testing: <br />
                                                                            0x96D91c8f5eE3C4478854944A7523d8975094D2B3 <br />
                                                                            0x033c90840F27C83B1Aa0Ffe6Db65C954BF6ABbdd <br />
                                                                            0x59F829DDfEe8aa3A53b3A00d23AD934Aaae69c05 <br />
                                                                        </div>
                                                                        :

                                                                        networkID === 97 ?
                                                                            <div>
                                                                                For testing: <br />
                                                                                0x769c15B3cD7a240FaE9194a71330FF6A9E6D1Cd9 <br />
                                                                                0xa85B5d02bD800611bdE58a1536C42F18F2f717B3 <br />
                                                                            </div>
                                                                            :
                                                                            null
                                                                }
                                                            </>
                                            }

                                            <Grid item xs={12} sx={{ margin: 1, display: "flex", justifyContent: "flex-end" }} >
                                                <Button
                                                    disabled={formData?.contractInfo?.name ? false : true}
                                                    size="small"
                                                    type="submit"
                                                    variant="contained"
                                                    onClick={() => handleNextStep("panel2", 1)}
                                                > Next </Button>
                                            </Grid>


                                        </Grid>

                                    </AccordionDetails>
                                </Accordion>
                            </Form>
                        </FromContainer>
                    )}
                </Formik>


                <Formik
                    initialValues={{ criteriaAddress: '', type: 0, tokensForLiquidity: 10000, tokensForSale: 70 }}
                    // validationSchema={schema1} 
                    onSubmit={async (values, { setFieldValue }) => {

                        const tokensReq = tokenomincs.tokensForSale * (1 + tokenomincs.tokensForLiquidity / 100)
                        const allownce = await formData.contractInfo.methods.allowance(userAddress, presaleData.contractAddress).call()
                        console.log(allownce);


                        console.log("saleinfo", values);
                        const saleinfo: SaleInfo = {
                            tokensForLiquidity: tokenomincs.tokensForLiquidity,
                            tokensForSale: tokenomincs.tokensForSale,
                            criteriaAddress: values.criteriaAddress,
                            type: saleType,
                            approvedTokens: Number(allownce),
                            tokenRequired: tokensReq
                        }

                        dispatch(setSaleInfo(saleinfo));

                    }}>

                    {() => (

                        <FromContainer>
                            <Form>
                                <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2bh-content"
                                        id="panel2bh-header"
                                    >
                                        <Typography sx={{ width: '33%', flexShrink: 0 }}>Crowd Sale Information</Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            Tokonomics
                                        </Typography>
                                    </AccordionSummary>


                                    <AccordionDetails>

                                        <Grid container sx={{ padding: 0 }}>

                                            <Grid item xs={4} lg={2} sx={{ padding: 1 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                                    <Field
                                                        component={Select}
                                                        onChange={handleSelect}
                                                        name="type"
                                                        value={saleType}
                                                        label="Type"
                                                        fullWidth
                                                    >
                                                        <MenuItem value={0} >Open For all</MenuItem>
                                                        <MenuItem value={1}>Only White Listed  </MenuItem>
                                                        <MenuItem value={2}>Only Token Holders</MenuItem>
                                                    </Field>

                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={4} lg={5} sx={{ padding: 1 }} >
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="tokensForSale"
                                                    onChange={(e: any) => handleTokenomics(e.target.value, "tokensForSale")}
                                                    value={tokenomincs.tokensForSale}
                                                    label="Tokens For sale"
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={4} lg={5} sx={{ padding: 1 }} >
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="tokensForLiquidity"
                                                    onChange={(e: any) => handleTokenomics(e.target.value, "tokensForLiquidity")}
                                                    value={tokenomincs.tokensForLiquidity}


                                                    label="Additional tokens for Liquidity pool in % "
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={12} sx={{ padding: 1 }} >
                                                {
                                                    saleType == 2 ?
                                                        <Field
                                                            component={TextField}
                                                            type="text"
                                                            name="criteriaAddress"
                                                            label="Criteria Conrtact Address"
                                                            fullWidth
                                                        />
                                                        :
                                                        null
                                                }
                                            </Grid>



                                            {
                                                tokenomincs.tokensForSale > 0 && tokenomincs.tokensForLiquidity > 0 && (
                                                    <Grid item xs={12} sx={{ border: "0px solid black", padding: 1, fontSize: "16px" }} >
                                                        <div> Total Toknes Required: {tokenomincs.tokensForSale * (1 + tokenomincs.tokensForLiquidity / 100)}</div>
                                                        <div> You hold: {formData.contractInfo?.youhold}</div>

                                                    </Grid>
                                                )
                                            }


                                            <Grid item xs={12} sx={{ margin: 1, display: "flex", justifyContent: "space-between" }} >
                                                <Button size="small" variant="contained" onClick={() => handlePreveousStep("panel1", 0)}> Preveous </Button>
                                                <Button
                                                    // disabled = {formData.contractInfo?.youhold > tokenomincs.tokensForSale * (1 + tokenomincs.tokensForLiquidity/100) ? false: true } 
                                                    size="small"
                                                    type="submit"
                                                    variant="contained"
                                                    onClick={() => handleNextStep('panel3', 2)}
                                                > Next </Button>
                                            </Grid>

                                        </Grid>

                                    </AccordionDetails>

                                </Accordion>
                            </Form>
                        </FromContainer>
                    )}
                </Formik>



                <Formik
                    initialValues={{ priceOfToken: 0.01, minTokensForParticipation: 250, minReqTokens: 50, maxReqTokens: 100, softCap: tokenomincs.softCap, }}
                    // validationSchema={schema1} 
                    onSubmit={async (values) => {
                        console.log(values);

                        const participationCriteria: ParticipationCriteria = {
                            maxReqTokens: values.maxReqTokens,
                            minReqTokens: values.minReqTokens,
                            minTokensForParticipation: values.minTokensForParticipation,
                            priceOfToken: values.priceOfToken,
                            softCap: values.softCap,
                            startingTime: times.startingTime,
                            endingTime: times.endingTime
                        }

                        dispatch(setParticipationCriteria(participationCriteria))

                    }}>

                    {() => (

                        <FromContainer>
                            <Form>
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
                                                    name="priceOfToken"
                                                    label={`Price of each Token in BNBs (e.g. 0.1 BNB = 1${formData.contractInfo?.symbol})`}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={6} sx={{ margin: 0 }} >
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="softCap"
                                                    label={`Soft cap for success of the project (should be more than ${tokenomincs.softCap})`}
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
                                                            value={times.startingTime}
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
                                                            value={times.endingTime}
                                                            onChange={handleEndingTime}
                                                            renderInput={(params) => <TextF {...params} />}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Grid>

                                            {
                                                saleType === 2 ?
                                                    <Grid item xs={12} sx={{ margin: 0 }} >
                                                        <Field
                                                            component={TextField}
                                                            type="number"
                                                            name="minTokensForParticipation"
                                                            label="Minimum Tokens For Participation (Only TokenHolder case) "
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    :
                                                    null
                                            }


                                            <Grid item xs={12} sx={{ margin: 1, display: "flex", justifyContent: "space-between" }} >
                                                <Button size="small" variant="contained" onClick={() => handlePreveousStep("panel2", 1)}> Preveous </Button>
                                                <Button size="small" variant="contained" type="submit" onClick={() => handleNextStep('panel4', 3)}> Next </Button>
                                            </Grid>

                                        </Grid>

                                    </AccordionDetails>
                                </Accordion>
                            </Form>
                        </FromContainer>
                    )}
                </Formik>


                <Formik
                    initialValues={{ description: "", websiteLink: "", discordLink: "", telegramLink: "", twitterLink: "" }}
                    // validationSchema={schema1} 
                    onSubmit={async (values, { setFieldValue }) => {
                        console.log(values);

                        const generalInfo: GeneralInfo = {
                            logo: logo ? logo : "",
                            description: values.description,
                            discordLink: values.discordLink,
                            telegramLink: values.telegramLink,
                            twitterLink: values.twitterLink,
                            websiteLink: values.websiteLink,
                        }

                        dispatch(setGeneralInfo(generalInfo))

                    }}>

                    {() => (

                        <FromContainer>
                            <Form>
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

                                            <Grid item xs={3} lg={1} sx={{ border: "0px solid black" }}>
                                                <Avatar sx={{ width: 70, height: 70 }} src={logo ? logo : ""} />
                                            </Grid>

                                            <Grid item xs={9} sx={{ border: "0px solid black", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                                <Button variant="contained" component="label" >
                                                    Upload Logo <input type="file" onChange={handleCapture} hidden />
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

                                                {/* <Field
                                                    component={TextareaAutosize}
                                                    type="text"
                                                    name="description"
                                                    // label="description"
                                                    placeholder=" Tell something about your project"
                                                    multiline="true"
                                                    style={{ width: "100%", minHeight: "50px" }}
                                                /> */}

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
                                                    name="discordLink"
                                                    label="Discord Link"
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

                                            <Grid item xs={12} sx={{ margin: 1, display: "flex", justifyContent: "space-between" }} >
                                                <Button size="small" variant="contained" onClick={() => handlePreveousStep("panel3", 2)}> Preveous </Button>
                                                <Button size="small" type="submit" variant="contained" onClick={() => handleSubmit("done", 4)}> Submit </Button>
                                            </Grid>


                                        </Grid>


                                    </AccordionDetails>
                                </Accordion>
                            </Form>
                        </FromContainer>
                    )}
                </Formik>



            </div>

            <Grid container spacing={0} >

                {
                    submit ?
                        <>
                            <Card sx={{ border: "0px solid black", margin: "5px" }}>
                                <Grid item xs={12} sx={{ border: "0px solid black", padding: "0px", }}>

                                    <div style={{ border: "0px solid black", paddingBottom: "10px", paddingTop: "10px", fontSize: "20px", fontWeight: 600, display: "flex", justifyContent: "center" }}> Summary </div>


                                    <div style={{ border: "0px solid black", margin: "10px", fontSize: "16px" }}>

                                        <Grid item xs={12} sx={{ paddingLeft: "10px", fontSize: "16px", fontWeight: 600 }} > Fees </Grid>

                                        <Grid container spacing={1} sx={{ padding: "10px", fontSize: "14px", fontWeight: 600 }}>

                                            <Grid item xs={6}>
                                                Upfront Fee: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {web3.utils.fromWei(String(presaleData.upforntFee), 'ether')} BNB </span>
                                            </Grid>

                                            <Grid item xs={6}>
                                                % on success: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {presaleData.percentageFee} % </span>
                                            </Grid>


                                        </Grid>

                                    </div>

                                    <Divider sx={{ margin: "10px 20px 10px 20px" }} />




                                    <div style={{ border: "0px solid black", margin: "10px", fontSize: "16px" }}>

                                        <Grid item xs={12} sx={{ paddingLeft: "10px", fontSize: "16px", fontWeight: 600 }} > Token's Data </Grid>

                                        <Grid container spacing={1} sx={{ padding: "10px", fontSize: "14px", fontWeight: 600 }}>

                                            <Grid item xs={12}>
                                                Token: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.contractInfo?.address}</span>
                                            </Grid>

                                            <Grid item xs={2}>
                                                Name: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>  {formData?.contractInfo?.name} </span>
                                            </Grid>

                                            <Grid item xs={2}>
                                                Symbol: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>  {formData?.contractInfo?.symbol}</span>
                                            </Grid>

                                            <Grid item xs={2}>
                                                Decimal: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>  {formData?.contractInfo?.decimal}</span>
                                            </Grid>

                                            <Grid item xs={4}>
                                                Total Supply: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>  {formData?.contractInfo?.totalSupply} </span>
                                            </Grid>

                                            <Grid item xs={2}>
                                                You hold: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.contractInfo?.youhold} </span>
                                            </Grid>
                                        </Grid>

                                    </div>

                                    <Divider sx={{ margin: "10px 20px 10px 20px" }} />

                                    <div style={{ border: "0px solid black", margin: "10px", fontSize: "16px" }}>

                                        <Grid item xs={12} sx={{ paddingLeft: "10px", fontSize: "16px", fontWeight: 600 }} > Sale's Data </Grid>

                                        <Grid container spacing={1} sx={{ padding: "10px", fontSize: "14px", fontWeight: 600 }}>

                                            <Grid item xs={3}>
                                                Type of sale: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>
                                                    {
                                                        formData?.saleInfo?.type === 0 ? <> Open </> :
                                                            formData?.saleInfo?.type === 1 ? <> Only White listed </> :
                                                                formData?.saleInfo?.type === 2 ? <> Only Token Holders </> :
                                                                    <> Unknown </>
                                                    }

                                                </span>
                                            </Grid>

                                            <Grid item xs={3}>
                                                Tokens for sale: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>  {formData?.saleInfo.tokensForSale} </span>
                                            </Grid>

                                            <Grid item xs={3}>
                                                Tokens for Liquidity: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.saleInfo.tokensForSale * formData?.saleInfo?.tokensForLiquidity / 100} </span>
                                            </Grid>

                                            <Grid item xs={3}>
                                                Total tokens to start project: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.saleInfo.tokensForSale * (1 + formData?.saleInfo?.tokensForLiquidity / 100)}  </span>
                                            </Grid>


                                        </Grid>

                                    </div>

                                    <Divider sx={{ margin: "10px 20px 10px 20px" }} />

                                    <div style={{ border: "0px solid black", margin: "10px", fontSize: "16px" }}>

                                        <Grid item xs={12} sx={{ paddingLeft: "10px", fontSize: "16px", fontWeight: 600 }} > Participation Criteria </Grid>

                                        <Grid container spacing={1} sx={{ padding: "10px", fontSize: "14px", fontWeight: 600 }}>

                                            <Grid item xs={6}>
                                                Price of each Token: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.participationCriteria?.priceOfToken} BNB </span>
                                            </Grid>

                                            <Grid item xs={6}>
                                                Soft Cap: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.participationCriteria?.softCap} </span>
                                            </Grid>

                                            {
                                                formData?.saleInfo?.type === 2 ?
                                                    <>
                                                        <Grid item xs={6}>
                                                            Minimum Tokens For Participation: <span style={{ margin: "10px", fontSize: "inherit", color: "#5272ff" }}> {formData?.participationCriteria?.minTokensForParticipation} </span>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            Criteria Conrtact Address: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.saleInfo?.criteriaAddress} </span>
                                                        </Grid>
                                                    </>
                                                    :
                                                    null
                                            }


                                            <Grid item xs={6}>
                                                Minimum requested Tokens: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.participationCriteria?.minReqTokens}  (minumum contribution: {formData?.participationCriteria?.minReqTokens * formData?.participationCriteria?.priceOfToken} BNB) </span>
                                            </Grid>

                                            <Grid item xs={6}>
                                                Maximum requested Tokens: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}> {formData?.participationCriteria?.maxReqTokens} (maximum contribution: {formData?.participationCriteria?.maxReqTokens * formData?.participationCriteria?.priceOfToken} BNB) </span>
                                            </Grid>

                                            <Grid item xs={6}>
                                                Start time: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>
                                                    {

                                                        `${new Date(formData?.participationCriteria?.startingTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                 ${new Date(formData?.participationCriteria?.startingTime).toLocaleTimeString('en-US', { timeZone: 'GMT', timeZoneName: 'short', hour12: false })} `

                                                    }


                                                </span>
                                            </Grid>

                                            <Grid item xs={6}>
                                                Ending time: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>
                                                    {

                                                        `${new Date(formData?.participationCriteria?.endingTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                ${new Date(formData?.participationCriteria?.endingTime).toLocaleTimeString('en-US', { timeZone: 'GMT', timeZoneName: 'short', hour12: false })} `

                                                    }
                                                </span>
                                            </Grid>

                                        </Grid>

                                    </div>

                                    <Divider sx={{ margin: "10px 20px 10px 20px" }} />

                                    <div style={{ border: "0px solid black", margin: "10px", fontSize: "16px" }}>

                                        <div style={{ marginBottom: "-50px", marginRight: "20px", border: "0px solid black", display: "flex", justifyContent: "flex-end" }}>
                                            <Avatar sx={{ width: 60, height: 60, right: "0px" }} src={formData?.generalInfo?.logo ? formData?.generalInfo?.logo : ""} />
                                        </div>

                                        <Grid item xs={12} sx={{ border: "0px solid black", paddingLeft: "10px", fontSize: "16px", fontWeight: 600 }} > Additional </Grid>

                                        <Grid container spacing={1} sx={{ padding: "10px", fontSize: "14px", fontWeight: 600 }}>

                                            <Grid item xs={12}>
                                                Descriotion:
                                                <div style={{ marginLeft: "10px", fontSize: "14px", fontWeight: 500, color: "#5272ff" }}>
                                                    {formData?.generalInfo?.description ? formData?.generalInfo?.description : <>None</>}
                                                </div>
                                            </Grid>


                                            <Grid item xs={12}>
                                                Website Link: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>
                                                    {
                                                        formData?.generalInfo?.websiteLink ?
                                                            <a style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }} href={formData?.generalInfo?.websiteLink} target="_blank">
                                                                {formData?.generalInfo?.websiteLink}
                                                            </a>
                                                            :
                                                            <>None</>
                                                    }

                                                </span>
                                            </Grid>

                                            <Grid item xs={12}>
                                                Discoed Link: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>

                                                    {
                                                        formData?.generalInfo?.discordLink ?
                                                            <a style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }} href={formData?.generalInfo?.discordLink} target="_blank">
                                                                {formData?.generalInfo?.discordLink}
                                                            </a>
                                                            :
                                                            <>None</>
                                                    }

                                                </span>
                                            </Grid>

                                            <Grid item xs={12}>
                                                Telegram Link: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>

                                                    {
                                                        formData?.generalInfo?.telegramLink ?
                                                            <a style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }} href={formData?.generalInfo?.telegramLink} target="_blank">
                                                                {formData?.generalInfo?.telegramLink}
                                                            </a>
                                                            :
                                                            <>None</>
                                                    }

                                                </span>
                                            </Grid>

                                            <Grid item xs={12}>
                                                Twitter Link: <span style={{ margin: "0px", fontSize: "inherit", color: "#5272ff" }}>
                                                    {
                                                        formData?.generalInfo?.twitterLink ?
                                                            <a style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }} href={formData?.generalInfo?.twitterLink} target="_blank">
                                                                {formData?.generalInfo?.twitterLink}
                                                            </a>
                                                            :
                                                            <>None</>
                                                    }

                                                </span>
                                            </Grid>
                                        </Grid>

                                    </div>

                                </Grid>
                            </Card>

                            {/* Put buttons here */}
                            <Grid item xs={12}
                                sx={{ border: process.env.REACT_APP_BORDER, display: "flex", justifyContent: "center", alignItems: "center", alignSelf: "center" }}>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className="form-button"
                                    size="small"
                                    sx={{ margin: 2 }}
                                    disabled={formData.contractInfo.youhold >= formData.saleInfo.tokenRequired ? false : true}
                                    onClick={() => approveTokens()}

                                >
                                    <div >Approve {formData.saleInfo.tokenRequired > 0 ? formData.saleInfo.tokenRequired : null} Tokens</div>

                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    sx={{ margin: 2 }}
                                    disabled={formData.saleInfo.approvedTokens !== 0 && formData.saleInfo.approvedTokens >= formData.saleInfo.tokenRequired ? false : true}
                                    onClick={() => submitPresale()}

                                >
                                    <div >Submit Presale</div>

                                </Button>

                            </Grid>
                        </>
                        :
                        null
                }



            </Grid>


        </div>
    )
}

export default InputForm
