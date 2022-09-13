const {api, data, http} = require("@serverless/cloud");
const cors = require("cors")
const {authenticate, addUserToDAO} = require("./server/near")
const {getSession, postSession} = require("./server/api")

api.use(cors());

api.get("/callback", async (req, res) => {

    console.log(req)
    // TODO save the session id and vote to add user to DAO
    res.send('Ok')
})

// Catch all for missing API routes
api.get("/complete", async (req, res) => {
    let session = req.query.sessionId
    let project = req.query.project

    let sessionResult = await getSession(session, project)
    console.log(sessionResult)
    let {isSessionComplete, externalId, isBlocked, hasBlockedAccounts, numCompletedSessions} = sessionResult

    if (!isSessionComplete) {
        res.send({error: "Session is not complete"})
        return;
    }
    if (isBlocked) {
        res.send({error: "User is blocked"})
        return;
    }
    if (hasBlockedAccounts) {
        res.send({error: "User has blocked accounts"})
        return;
    }
    if (numCompletedSessions >= 2) {
        res.send({error: "User has already signed up"})
        return;
    }


    let account = await authenticate()
    let smartContractResponse = await addUserToDAO(account, 'nearcon', externalId, "https://webhook.site/e5596df5-fa5b-4432-8e49-978b211647a2")
    console.log(smartContractResponse)
    console.log("Proposal added to the DAO");
    // TODO save the session status to track callback

    res.send({ok: 'ok'})
});

api.get("/session", async (req, res) => {
        let address = req.query.address
        let project = req.query.project
        console.log(project, address);
        let session = await postSession(project, address)
        res.send({session})
    }
)

api.get("/findSession", async (req, res) => {
        let sessionId = req.query.sessionId
        let project = req.query.project
        let sessionResult = await getSession(sessionId, project)
        res.send(sessionResult)
    }
)