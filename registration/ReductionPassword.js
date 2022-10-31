const db = require("../database/db");
const {mailMessages} = require("../mail/MailMessages");
const {randomInteger} = require("./createUser");

async function ReductionPassword(href) {
    let reg = /\/\w+\/\w+\?(\w+)?=?(\w+@\w+.\w+)?&?(\w+)?=?(\d+)?(\w+)?/i
    let result = href.match(reg)
    let generateCode = randomInteger(10000, 99999)
    let mail = result[2]
    let hrefCode = result[4]
    let password = result[5]
    if (hrefCode != null){
        const checkSessRedCode = await db.checkSessReductionCode(mail,hrefCode)
        if (checkSessRedCode){
            return {response: true}
            // return {response: true, description:'coincided'}
        } else{
            return {"error": {
                "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'did not match'
            }}
        }
    }
    else if(password != null){
        const checkSessRedCode = await db.checkSessReductionMail(mail)
        if (checkSessRedCode){
            const delSessRedCode = await db.deleteSessReductionCode(mail)
            const update = await db.updatePassword(mail,password)
            // return {response: true, description:'edited'}
            return {response: true, description:'edited'}
        } else{
            return {"error": {
                    "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'did not match'
                }}
        }
    }
    else if(mail == null){
        return {"error": {
                "statusCode": 400,
                "name": "Bad request",
                "message": 'incorrect request'
            }}
    }
    else{
        const checkDb = await db.checkWithMail(mail)
        if (checkDb){
            const mailMess = await mailMessages(mail, generateCode)
            const sessRed = await db.sessionReduction([mail,generateCode])
            return {response: true}
            // return {response: true, mail: `${mail}`, code: 'sent'}
        } else {
            return {"error": {
                    "statusCode": 401,
                    "name": "unAuthorized"
                }}
        }
    }
}

module.exports = {
    ReductionPassword
}