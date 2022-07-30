const { OAuth2Client } = require('google-auth-library');
const User = require("../models/user");
//const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxODkyZWI0OWQ3ZWY5YWRmOGIyZTE0YzA1Y2EwZDAzMjcxNGEyMzciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5Njc4MzkwNDM0NDItZWg5ZjlvdnZ0Mmt2MTE4cWdjOTRqYzBvamU2MmpvdnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5Njc4MzkwNDM0NDItZWg5ZjlvdnZ0Mmt2MTE4cWdjOTRqYzBvamU2MmpvdnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTA0NzMzMzIxMTU4MjQzMTYiLCJlbWFpbCI6Inl1dmFsYWxvbjUxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IllNOUJTVDNaUU95Tl82MnBSSWRPU3ciLCJuYW1lIjoi15nXldeR15wg15DXnNeV158iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKekd1eVNQTTl6NnJXSk9EMTQ2S3J2QzZoM09rQ3RFTnVjMm05WkE9czk2LWMiLCJnaXZlbl9uYW1lIjoi15nXldeR15wiLCJmYW1pbHlfbmFtZSI6IteQ15zXldefIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE2MzkyMTgwMDIsImV4cCI6MTYzOTIyMTYwMn0.S1bU-jTTqz5cLQDODKOU00v8uw3jpyrDKSoW9QWATcfbg0CSA0itEzKXQVCZ8-ubCjf3uw3jjpSjTJ3EEChsQ9N9-g1bZyoGzZYDIhUVm2qaJAjU5WyMsXJED8g4J_ever-f9y2NGz05kgkuLYVu2qLsDdfZpApxpa2tInNyRNctb2FOkDXBuZTENSCdTsRdsmVQUWlNFeI5fkIGL2iGyEpS2fH5o2d4HjVMW46IO0Nv9ev3uZf4Wr2qyiTU6CI5dfdSwtumx3QnWhb4nrZRgSdoqutGY3unofP7bg5yN8KYb14mrExK5K_vQlTCfdgBTxWRsNuFOuuyqru2BBNAIg";
//const clientId = "967839043442-eh9f9ovvt2kv118qgc94jc0oje62jovv.apps.googleusercontent.com";


/* Authenticates user with google
 
 The request is requires Authorization and userId headers
*/    
const googleAuth = async (req, res, next) => {
    const client = new OAuth2Client(process.env.clientId);
    // see how ti get this
    const idToken = req.header("Authorization").replace("Bearer ", "");

    client.verifyIdToken({
        idToken,
        audience: process.env.clientId
    }).then((ticket) => {
        req.payload = ticket.getPayload();
        req.googleUserId = ticket.getUserId();
        console.log(`Authenicated user ${ticket.getPayload().given_name}`);
        next();
    }).catch((e) => {
        console.log(e);
        res.status(401).send({ error: e });
    });
};

module.exports = googleAuth;