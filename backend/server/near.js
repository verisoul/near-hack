const nearAPI = require("near-api-js");
const {keyStores, KeyPair, providers, WalletConnection, connect, Contract, utils} = nearAPI;

const authenticate = async () => {
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY = "ed25519:2fzADnzZhtswdw6V4S9VcC5NW55kZSGgM8ostHafj4mGEfW2xckSqASXLfajtp1rkFyRGi6H5hp3AJiYBL9aY6ts";
// creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
// adds the keyPair you created to keyStore
    await myKeyStore.setKey("mainnet", "verisoul-bot.near", keyPair);

    const connectionConfig = {
        networkId: "mainnet",
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
    };

// connect to NEAR
    const nearConnection = await connect(connectionConfig);

    let account = await nearConnection.account("verisoul-bot.near");
    return account
}


const addUserToDAO = async (account, daoId, userId, callback, bondInNear = "0.001", gas = 30000000000000) => {
    const contract = new Contract(
        account, // the account object that is connecting
        `${daoId}.sputnik-dao.near`,
        {
            // name of contract you're connecting to
            changeMethods: ["add_proposal"], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
        }
    );

    const bondInYocto = utils.format.parseNearAmount(bondInNear);
    console.log("Trying to add a proposal to the DAO");
    await contract.add_proposal({
        callback,
        meta: 'testing',
        args: {
            "proposal": {
                "description": "Testing adding two users at once$$$$$$$$ProposeAddMember",
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
}

module.exports = {
    addUserToDAO,
    authenticate
}