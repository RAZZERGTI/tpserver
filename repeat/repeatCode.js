const db = require('../database/db')
const createCode = require("../registration/createUser");
const registrationMailMessage = require("../mail/MailMessages");

async function repeatCode(href){
    let reg = /\/\w+\/\w+\?\w+=?(\w+)&\w+=(\w+@\w+.\w+)?/i
    let result = href.match(reg)
    let table = result[1]
    let mail = result[2]
    let code = createCode.randomInteger(10000, 99999)
    if (table === 'registration'){
        let checkSession = await db.infoCheckDb('registration','mail',mail)
        if (checkSession){
            let update = await db.updateField('registration','code', code, mail)
            const regMail = await registrationMailMessage.mailMessages(mail, code)
            return{
                response:true
            }
        }
        else{
            return {"error": {
                    "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'user ins`t in session'
                }}
        }
    }
    else if(table === 'authorization'){
        let checkSession = await db.infoCheckDb('authorization','mail',mail)
        if (checkSession){
            let update = await db.updateField('authorization','code', code, mail)
            const regMail = await registrationMailMessage.mailMessages(mail, code)
            return{
                response:true
            }
        }
        else{
            return {"error": {
                    "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'user ins`t in session'
                }}
        }
    }
    else if(table === 'reduction'){
        let checkSession = await db.infoCheckDb('reduction','mail',mail)
        if (checkSession){
            let update = await db.updateField('reduction','code', code, mail)
            const regMail = await registrationMailMessage.mailMessages(mail, code)
            return{
                response:true
            }
        }
        else{
            return {"error": {
                    "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'user ins`t in session'
                }}
        }
    }
    else{
        return {"error": {
                "statusCode": 401,
                "name": "unAuthorized",
                "message": 'field is empty or incorrect data'
            }}
    }
}

module.exports = {
    repeatCode
}