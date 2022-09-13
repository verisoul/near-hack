const {api, events} = require("@serverless/cloud");
const cors = require("cors")
const {authenticate, addUserToDAO, voteOnProposal, addUserToVerisoulContract} = require("./server/near")
const {getSession, postSession} = require("./server/api")

const DAO_NAME = "nearcon"
const DAO_ID = DAO_NAME + ".sputnik-dao.near"
const PROJECT = "Nearcon_Afterparty_DAO"


api.use(cors());

// Catch all for missing API routes
api.get("/complete", { timeout: 30000 }, async (req, res) => {
    let session = req.query.sessionId
    let project = req.query.project

    const sessionResult = await getSession(session, project)

    let {isSessionComplete, externalId, isBlocked, hasBlockedAccounts, numAccounts} = sessionResult

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
    if (numAccounts >= 2) {
        res.send({error: "User has already signed up"})
        return;
    }

    await events.publish("newuser", {
       externalId,
    })

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

events.on("newuser", { timeout: 30000 }, async ({body}) => {
    console.log("New user", body)

    let {externalId} = body
    const account = await authenticate()
    const [proposalId, inVerisoulContract] = await Promise.all([
            addUserToDAO(account, DAO_ID, externalId),
            addUserToVerisoulContract(account, PROJECT, externalId)
        ]
    )

    const proposal_url = `https://app.astrodao.com/dao/${DAO_ID}/proposals/${DAO_ID}-${proposalId}`
    console.log("Proposal URL", proposal_url)
    await voteOnProposal(account, DAO_ID, proposalId)
    console.log(`Proposal voted on ${proposalId}`);
})