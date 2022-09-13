const fetch = require('node-fetch');
const {params} = require('@serverless/cloud')
const headers = {
    'Content-Type': 'application/json',
    'x-api-key': params.PROD_API_KEY
}
const postSession = async (project, address) => {

    let raw = JSON.stringify({
        "project": project,
        "externalId": address
    });

    let requestOptions = {
        method: 'POST',
        headers,
        body: raw,
        redirect: 'follow'
    };

    let response = await fetch("https://i5yha6z92c.execute-api.us-east-1.amazonaws.com/test/session", requestOptions)
    let request = await response.json();
    console.log(request)
    let {sessionId} = request

    return sessionId
}

const getSession = async (project, sessionId) => {
    let requestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow'
    };

    const params = new URLSearchParams({project, sessionId})

    let response = await fetch("https://i5yha6z92c.execute-api.us-east-1.amazonaws.com/test/session" + params, requestOptions)
    return await response.json();
}

module.exports = {
    postSession,
    getSession
}