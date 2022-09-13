const {api, data, http} = require("@serverless/cloud");

const cors = require("cors")

const {authenticate, addUserToDAO} = require("./server/near")
const {getSession, postSession} = require("./server/api")


api.use(cors());


// Create GET route and return users
api.get("/balance", async (req, res) => {
    // Get users from Serverless Data
    // let result = await data.get("user:*", true);
    // Return the results
    let account = await authenticate()
    let balance = await account.getAccountBalance();

    res.send({
        balance
    });
});

api.get("/callback", async (req, res) => {

    console.log(req)
    res.send('Ok')
})

// Catch all for missing API routes
api.get("/complete", async (req, res) => {
    let session = req.query.sessionId
    let project = req.query.project

    let sessionResult = await getSession(session, project)

    let {isSessionComplete, externalId, isBlocked, hasBlockedAccounts, numCompletedSessions} = sessionResult

    if(!isSessionComplete){
        res.send({error: "Session is not complete"})
        return;
    }
    if(isBlocked){
        res.send({error: "User is blocked"})
        return;
    }
    if(hasBlockedAccounts){
        res.send({error: "User has blocked accounts"})
        return;
    }
    if(numCompletedSessions >= 2){
        res.send({error: "User has already signed up"})
        return;
    }


    let account = await authenticate()
    await addUserToDAO(account, 'nearcon', externalId, "https://innovative-source-ebf06.cloud.serverless.com/callback")
    console.log("Proposal added to the DAO");

    res.send({ok: 'ok'})
});

api.get("/session", async (req, res) => {
        let address = req.query.address
        let project = req.query.project
    console.log(project, address)
        let session = await postSession(project, address)
        res.send({session})
    }
)