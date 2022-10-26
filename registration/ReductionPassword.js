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
            return {status: '200 OK', code:'coincided'}
        } else{
            return {status: '205 Reset Content', code:'did not match'}
        }
    }
    else if(password != null){
        const checkSessRedCode = await db.checkSessReductionMail(mail)
        if (checkSessRedCode){
            const delSessRedCode = await db.deleteSessReductionCode(mail)
            const update = await db.updatePassword(mail,password)
            return {status: '200 OK', password: 'edited'}
        } else{
            return {status: '205 Reset Content', mail: 'did not match'}
        }
    }
    else if(mail == null){
        return {status: '205 Reset Content', template: 'incorrect'}
    }
    else{
        const checkDb = await db.checkWithMail(mail)
        if (checkDb){
            const mailMess = await mailMessages(mail, generateCode)
            const sessRed = await db.sessionReduction([mail,generateCode])
            return {status: '200 OK', mail: `${mail}`, code: 'sent'}
        } else {
            return {status: '205 Reset Content', mail: `${mail}`}
        }
    }
}

module.exports = {
    ReductionPassword
}