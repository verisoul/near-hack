import 'regenerator-runtime/runtime';
import {useState, useEffect} from 'react';
import Verisoul from '@verisoul/ui';
import './assets/global.css';
import daoLogo from './assets/dao-logo.png';

import {SignOutButton} from './sign-out-button';
import {Button, Container, Grid, Skeleton, Typography} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorMessage from "./error";

const src = "/js/auth-sdk/facescan"
const BACKEND = "https://reliable-build-ojswk.cloud.serverless.com"
// const BACKEND = "https://innovative-source-ebf06.cloud.serverless.com"
const project = "Near";
export default function App({isSignedIn, wallet}) {
    const [showVerisoul, setShowVerisoul] = useState(false);
    const [complete, setComplete] = useState(false);
    const [session, setSession] = useState(null);
    const [errorString, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem("ft_path", src)
        if(isSignedIn){
            getSession()
        }
    },[])

    const getSession = async () => {
        const response = await fetch(BACKEND + `/session?address=${wallet.accountId}&project=${project}`, );
        const {session} = await response.json();
        console.log(session)
        setSession(session);
    }

    const completeSession = async () => {
        const response = await fetch(BACKEND + `/complete?sessionId=${session}&project=${project}`);
        const result = await response.json();
        let {error} = result;
        if(error) {
            console.log(error)
            setLoading(false)
            setError(error)
        }
    }

    const eventHandler = (event) => {
        console.log(event);
        if (event?.state?.step === 'complete') {
            setShowVerisoul(false);
            setComplete(true);
            completeSession();
        }
    }

    if (complete) {
        return (<Container>
            {isSignedIn ? <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/> : null}
            <ErrorMessage message={errorString}/>
            <Grid
                container
                spacing={5}
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                textAlign={"center"}
            >
                <Grid item>
                    <img src={daoLogo} className='logo' alt='DaoLogo' style={{
                        height: '200px', width: '200px'
                    }}/>
                </Grid>
                <Grid item xs={8}>
                    {errorString !== null ? <Typography variant="h4"> Unable to join the project </Typography> :
                        <Typography variant={'h4'}>
                            {loading ? <Skeleton/> : (`You've joined` + <br/> + `NEARCON Afterparty DAO!`)}
                        </Typography>
                    }
                </Grid>
                <Grid item xs={8}>
                    <LoadingButton variant={'contained'} loading={loading}
                            onClick={() => window.open("https://app.astrodao.com/dao/nearcon.sputnik-dao.near", "_self")}>
                        {errorString !== null ? "View After Party DAO" : `Vote on your preferred afterparty option`}
                    </LoadingButton>
                </Grid>
            </Grid>
        </Container>)
    } else {
        return (<Container>
            {(showVerisoul && session) ? <Verisoul session={session} project={"Near"} eventHandler={eventHandler}
                                      src={src}/> : <Container>
                {isSignedIn ? <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/> : null}
                <ErrorMessage message={errorString}/>
                <Grid
                    container
                    spacing={5}
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    textAlign={"center"}
                >
                    <Grid item>
                        <img src={daoLogo} className='logo' alt='DaoLogo' style={{
                            height: '200px', width: '200px'
                        }}/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant={'h4'}>
                            Join the NEARCON<br/> Afterparty DAO!
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant={'subtitle'}>
                            Join the DAO to vote on where we will host the unofficial after party.
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant={'subtitle'}>
                            This is the first DAO to ever use one-person-one-vote governance.
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        {isSignedIn ? <Button variant={'contained'} onClick={() => setShowVerisoul(true)}>
                            Begin Registration!
                        </Button> : <Button variant={'contained'} onClick={() => wallet.signIn()}>
                            Sign in with NEAR Wallet
                        </Button>}
                    </Grid>
                </Grid>
            </Container>}
        </Container>)
    }
}
