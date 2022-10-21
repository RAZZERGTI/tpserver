const express = require('express');
const app = express();
const port = 3001;
const pid = process.pid

const createUser = require('./registration/createUser');
app.get('/api/registration?', async function(req, res) {
    try{
        let url = `${req.originalUrl}`
        const create = await createUser.registrationUser(url)
        res.send(create)
    } catch(e) {
        console.log(e)
    }
});
app.get('/api/checkCode?', async function(req, res) {
    try{
        let url = `${req.originalUrl}`
        const confirmCode = await createUser.confirmCode(url)
        res.send('Добавил')
    } catch(e) {
        console.log(e)
    }
});

app.get('/api/reductionPassword?', async function(req, res){
    try{
        let url = `${req.originalUrl}`
        const redPass = await createUser.ReductionPassword(url)
        // res.send('Добавил')
    } catch(e) {
        console.log(e)
    }
})
app.listen(port, () => {
    console.log(`\nServer started ${port}...\nPID - ${pid}`)
})
