import React, {FC} from 'react'
import Grid from '@mui/material/Grid';
import {DetailContainer, UpdatesContainer, GuideContainer, UpdatesDiv, DiscriptionHeading, ParticipationDetails} from './styles';
import {RulesProps} from './interfaces';
import { Form, Formik, Field } from "formik";
import { TextField } from 'formik-material-ui';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import {TextField as TextF} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';


const Rules: FC<RulesProps> = ({ownerView, saleEnded}) => {
    console.log("Owner2 => ", ownerView)


    const [time, setTime] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );
    
    const handleStartingTime = (newValue: Date | null) => {
        if(newValue)
        console.log(newValue?.getTime() / 1000);
    };

    const handleEndingTime = (newValue: Date | null) => {
        if(newValue)
        console.log(newValue?.getTime() / 1000);
    };

console.log(process.env.REACT_APP_BORDER)

    return (
        <>
        {
            !ownerView ?
                <DetailContainer>
                    Guide for Particpants
                    <GuideContainer>
                        Guide Section
                    </GuideContainer>
                </DetailContainer> 
                :
                <DetailContainer>
                    Guide for Project Owner
                    
                    <GuideContainer>
                        Guide Section
                    </GuideContainer>

                    <UpdatesContainer>
                        Update Section


                        <UpdatesDiv>
                            Update Participation Criteria

                            <Formik 
                                initialValues={{ tokens: 500 }}
                                // validationSchema={schema1} 
                                onSubmit={async (values, { setFieldValue }) => {
                                    console.log(values);
                                }}>

                                {() => (
                                        <Form>
                                            <Grid container
                                            sx={{ border: process.env.REACT_APP_BORDER, display: "flex", justifyContent:"center", alignItems: "center", alignSelf: "center"}}
                                            >
                                            <Grid item xs={12} sx={{ margin: 0.5 }} >
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="priceOfEachToken"
                                                    label="Price of Token iin BNB (e.g. 0.2 BNB)"
                                                    fullWidth
                                                    />
                                            </Grid>
                                            <Grid item xs={12} sx={{ margin: 0.5 }} >
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="minTokenForParticipation"
                                                    label="Minimum Tokens for Participation"
                                                    fullWidth
                                                    />
                                            </Grid>
                                            <Grid item xs={12} sx={{ margin: 0.5 }} >
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    name="address"
                                                    label="Min Token Request"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{ margin: 0.5 }} >
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
                                                className="form-button"
                                                sx={{ margin: 0.5}}
                                                disabled = {saleEnded ? true:false}
                                                >
                                                <div >Update</div>

                                            </Button>

                                            </Grid>
                                        </Form>
                                )}
                            </Formik>

                        </UpdatesDiv>


                        <UpdatesDiv>
                            Update Project Time
                            <Formik 
                                initialValues={{ tokens: 500 }}
                                // validationSchema={schema1} 
                                onSubmit={async (values, { setFieldValue }) => {
                                    console.log(values);
                                }}>

                                {() => (
                                        <Form>
                                            <Grid container spacing= {0} 
                                            sx={{ border: process.env.REACT_BORDER, display: "flex", justifyContent:"center", alignItems: "center", alignSelf: "center"}}
                                            >
                                                <Grid item xs={12} sx={{ margin: 0.5}} >
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

                                                    <Grid item xs={12} sx={{ margin: 0.5 }} >
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
                                                        className="form-button"
                                                        sx={{ margin: 0.5}}
                                                        disabled = {saleEnded ? true:false}
                                                        >
                                                        <div >Update</div>

                                                    </Button>

                                                </Grid>
                                        </Form>
                                )}
                            </Formik>

                        </UpdatesDiv>

                        <UpdatesDiv>
                            White List An Account
                            <Formik 
                                initialValues={{ address: "" }}
                                // validationSchema={schema1} 
                                onSubmit={async (values, { setFieldValue }) => {
                                    console.log(values);
                                }}>

                                {() => (
                                        <Form>
                                            <Grid container spacing= {0} 
                                            sx={{ border: process.env.REACT_APP_BORDER, display: "flex", justifyContent:"center", alignItems: "center", alignSelf: "center"}}
                                            >
                                              <Grid item xs={12} sx={{ margin: 0.5 }} >
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
                                                        className="form-button"
                                                        sx={{ margin: 0.5}}
                                                        disabled = {saleEnded ? true:false}
                                                        >
                                                        <div >White List</div>

                                                    </Button>

                                                </Grid>
                                        </Form>
                                )}
                            </Formik>

                        </UpdatesDiv>

                        <UpdatesDiv>
                            Update Criteria Token
                            <Formik 
                                initialValues={{ address: "" }}
                                // validationSchema={schema1} 
                                onSubmit={async (values, { setFieldValue }) => {
                                    console.log(values);
                                }}>

                                {() => (
                                        <Form>
                                            <Grid container spacing= {0} 
                                            sx={{ border: process.env.REACT_APP_BORDER, display: "flex", justifyContent:"center", alignItems: "center", alignSelf: "center"}}
                                            >
                                              <Grid item xs={12} sx={{ margin: 0.5 }} >
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
                                                        className="form-button"
                                                        sx={{ margin: 0.5}}
                                                        disabled = {saleEnded ? true:false}
                                                        >
                                                        <div >Update</div>

                                                    </Button>

                                                </Grid>
                                        </Form>
                                )}
                            </Formik>

                        </UpdatesDiv>
                    </UpdatesContainer>

                </DetailContainer> 
        }

        </>
    )
}

export default Rules
