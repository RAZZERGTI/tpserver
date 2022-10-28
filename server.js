const express = require('express');
const app = express();
const port = 3001;
const pid = process.pid

const createUser = require('./registration/createUser');
const authUser = require('./authorization/authUser')
const confirmCode = require('./registration/confirmCode')
const reduction = require('./registration/ReductionPassword')

app.get('/api/registration?', async function(req, res) {
    try{
        let url = `${req.originalUrl}`
        const create = await createUser.registrationUser(url)
        res.send(create)
    } catch(e) {
        return {
            "error": {
            "statusCode": 500,
                "name": "Internal Server Error",
                "message": `${e}`
        }}
    }
});

app.get('/api/authorization?', async function(req, res) {
    try{
        let url = `${req.originalUrl}`
        const auth = await authUser.authUser(url)
        res.send(auth)
    } catch(e) {
        return {
            "error": {
                "statusCode": 500,
                "name": "Internal Server Error",
                "message": `${e}`
            }}
    }
});

app.get('/api/checkCode?', async function(req, res) {
    try{
        let url = `${req.originalUrl}`
        const confirmCoding = await confirmCode.confirmCode(url)
        res.send(confirmCoding)
    } catch(e) {
        return {
            "error": {
                "statusCode": 500,
                "name": "Internal Server Error",
                "message": `${e}`
            }}
    }
});

app.get('/api/reductionPassword?', async function(req, res){
    try{
        let url = `${req.originalUrl}`
        const redPass = await reduction.ReductionPassword(url)
        res.send(redPass)
    } catch(e) {
        return {
            "error": {
                "statusCode": 500,
                "name": "Internal Server Error",
                "message": `${e}`
            }}
    }
})

app.listen(port, () => {
    console.log(`\nServer started ${port}...\nPID - ${pid}`)
})