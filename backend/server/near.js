const nearAPI = require("near-api-js");
const {keyStores, KeyPair, providers, WalletConnection, connect, Contract, utils} = nearAPI;
const {params} = require('@serverless/cloud')

const authenticate = async () => {
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY = params.MAINNET_PRIVATE_KEY;
// creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
// adds the keyPair you created to keyStore
    await myKeyStore.setKey(params.NETWORK, params.PROPOSAL_ACCOUNT, keyPair);

    const connectionConfig = {
        networkId: params.NETWORK,
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
    };

// connect to NEAR
    const nearConnection = await connect(connectionConfig);
    let account = await nearConnection.account(params.PROPOSAL_ACCOUNT);
    return account
}


const addUserToDAO = async (account, daoId, userId, bondInNear = "0.001", gas = 30000000000000) => {
    const contract = new Contract(
        account, // the account object that is connecting
        `${daoId}`,
        {
            // name of contract you're connecting to
            changeMethods: ["add_proposal"], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
        }
    );

    const bondInYocto = utils.format.parseNearAmount(bondInNear);
    console.log("Trying to add a proposal to the DAO");
    let result = await contract.add_proposal({
        meta: 'Verisoul Bot Proposal',
        args: {
            "proposal": {
                "description": `${params.PROPOSAL_ACCOUNT} verified ${userId} uniqueness and is requesting to add them to the DAO`,
                "kind": {
                    "AddMemberToRole": {
                        "member_id": userId,
                        "role": "verified"
                    }
                }
            },
        },
        gas,
        amount: bondInYocto // attached deposit in yoctoNEAR (optional)
    })
    console.log(result);
    return result
}

const voteOnProposal = async (account, daoId, proposalId, gas = 30000000000000) => {
    const contract = new Contract(
        account, // the account object that is connecting
        `${daoId}`,
        {
            // name of contract you're connecting to
            changeMethods: ["act_proposal"], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
        }
    );

    let id = typeof proposalId === "number" ? proposalId : parseInt(proposalId);

    console.log("Trying to vote on a proposal");
    await contract.act_proposal({
        meta: 'Verisoul Bot Vote',
        args: {
            id,
            "action": "VoteApprove"
        },
        gas
    })
    console.log("Voted on proposal");
}

const addUserToVerisoulContract = async (account, project, userId, gas = 30000000000000) => {
    const contract = new Contract(
        account, // the account object that is connecting
        `verisoul-bot.near`,
        {
            changeMethods: ["add_verified_wallet"], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
        }
    )
    console.log("Trying to add a verified wallet to the Verisoul contract");
    let result = await contract.add_verified_wallet(
        {
            meta: "Verisoul Bot Adding Verified Wallet",
            args: {
                projectName: project,
                address: userId
            },
            gas
        }
    )
    if(result) {
        console.log("Added verified wallet to Verisoul contract");
    } else {
        console.log("Failed to add verified wallet to Verisoul contract");
    }
    return result

}

module.exports = {
    addUserToDAO,
    authenticate,
    voteOnProposal,
    addUserToVerisoulContract
}