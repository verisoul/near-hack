import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Wallet } from './near-wallet';
import { Contract } from './near-interface';
import startUnitTests from "./tests/test";

const root = ReactDOM.createRoot(document.getElementById('root'));


// create the Wallet and the Contract
const contractId = process.env.CONTRACT_NAME;
const wallet = new Wallet({contractId: contractId});
const contract = new Contract({wallet: wallet});


window.onload = wallet.startUp()
  .then((isSignedIn) => {
    root.render(<App isSignedIn={isSignedIn} contract={contract} wallet={wallet} />);
  })
  .catch(error => {
    root.render(<div style={{color: 'red'}}>Error: <code>{error.message}</code></div>);
    console.error(error);
  });

window.onload = startUnitTests();
