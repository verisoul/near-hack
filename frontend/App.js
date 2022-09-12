import 'regenerator-runtime/runtime';
import React from 'react';
import Verisoul from '@verisoul/ui';

import './assets/global.css';

import {EducationalText, SignInPrompt, SignOutButton} from './ui-components';


export default function App({isSignedIn, contract, wallet}) {
    const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
    const [showVerisoul, setShowVerisoul] = React.useState(false);

    const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

    // Get blockchian state once on component load
    React.useEffect(() => {
        contract.getGreeting()
            .then(setValueFromBlockchain)
            .catch(console.log)
            .finally(() => {
                setUiPleaseWait(false);
            });
    }, []);

    /// If user not signed-in with wallet - show prompt
    if (!isSignedIn) {
        // Sign-in flow will reload the page later
        return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
    }

    const eventHandler = (event) => {
        console.log(event)
        if(event?.state?.step === 'complete'){
            setShowVerisoul(false)
        }
    }


    const verisoulRender = () => {
        if (showVerisoul) {
            return (
                <Verisoul session={"1234"} project={"Complete"} eventHandler={eventHandler} src={"/js/auth-sdk/facescan"}/>
            )

        }
    }

    return (
        <>
          <div>
            {verisoulRender()}
          </div>
            <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
            <main className={uiPleaseWait ? 'please-wait' : ''}>
                <h1>
                    The contract says: <span className="greeting">{valueFromBlockchain}</span>
                </h1>
                <button onClick={() => setShowVerisoul(!showVerisoul)}>Show Verisoul</button>
                <EducationalText/>
            </main>
        </>
    );

}
