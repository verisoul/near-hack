import 'regenerator-runtime/runtime';
import {useState, useEffect} from 'react';
import Verisoul from '@verisoul/ui';
import './assets/global.css';
import daoLogo from './assets/dao-logo.png';

import {SignOutButton} from './sign-out-button';
import {Button, Container, Grid, Typography} from "@mui/material";

const BACKEND = "https://innovative-source-ebf06.cloud.serverless.com"
const project = "Near";
export default function App({isSignedIn, wallet}) {
    const [showVerisoul, setShowVerisoul] = useState(false);
    const [complete, setComplete] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
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
        const response = await fetch(BACKEND + `/complete?address=${wallet.accountId}&project=${project}`);
        const {error, ok} = await response.json();
        if(ok){
            // TODO show success page
        } else {
            // TODO show error page
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
                        You've joined<br/> NEARCON Afterparty DAO!
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Button variant={'contained'}
                            onClick={() => window.open("https://app.astrodao.com/dao/nearcon.sputnik-dao.near", "_self")}>
                        Vote on your preferred afterparty option
                    </Button>
                </Grid>
            </Grid>
        </Container>)
    } else {
        return (<Container>
            {(showVerisoul && session) ? <Verisoul session={session} project={"Near"} eventHandler={eventHandler}
                                      src={"/js/auth-sdk/facescan"}/> : <Container>
                {isSignedIn ? <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/> : null}
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
