const db = require('../database/db')
const session = require('../registration/sessionCode')
const {mailMessages} = require("../mail/MailMessages");
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
async function registrationUser(href){
    let reg = /\/\w+\/\w+\?([a-z]+)=([a-z\d]+)&([a-z]+)=([a-z\d-]+\.*[a-z\d_-]+@[a-z]+.[a-z]+)&([a-z]+)=([A-Za-z\d]+)/i
    let result = href.match(reg)
    let name = result[2]
    let mail = result[4]
    let password = result[6]
    let user = await db.checkDbUser(name)
    if (user){
        return `Пользователь с таким именем уже существует`
    } else {
        let idUser = randomInteger(100000000, 999999999)
        let code = randomInteger(10000, 99999)
        const arrCode = [idUser, `${name}`,`${mail}`,`${password}`,code]
        const sessCode = await session.sessionCode(arrCode)
        return {
            id: idUser,
            name: `${name}`,
            mail: `${mail}`,
            password: `${password}`,
        }
    }
}

async function confirmCode(href){
    let pattern = /\/\w+\/\w+\?([a-z]+)=(\d+)&([a-z]+)=(\d+)/i
    let result = href.match(pattern)
    let id = result[2]
    let code = result[4]
    let sessCode = await db.checkDbCode(id)
    console.log(sessCode)
    let array = [sessCode.id,sessCode.name,sessCode.mail, sessCode.password]
    if (`${sessCode.code}` === code) {
        const record = await db.recordingUser(array)
        const del = await db.deleteDbCode(array)
        console.log('Код совпал и сессия была удалена')
        return `Добавил`
    }
    else {
        return `Код не совпадает`
    }
}
async function ReductionPassword(href) {
    let reg = /\/\w+\/\w+\??(\w+)?=?(\w+@\w+.\w+)?&?(\w+)?=?(\d+)?(\w+)?/i
    let result = href.match(reg)
    console.log(result)
    let generateCode = randomInteger(10000, 99999)
    let mail = result[2]
    let hrefCode = result[4]
    let password = result[5]
    if (hrefCode != null){
        const checkSessRedCode = await db.checkSessReductionCode(mail,hrefCode)
        if (checkSessRedCode){
            return {status: true, code:'coincided'}
        } else{
            return {status: false, code:'did not match'}
        }
    }
    else if(password != null){
        const checkSessRedCode = await db.checkSessReductionMail(mail)
        if (checkSessRedCode){
            const delSessRedCode = await db.deleteSessReductionCode(mail)
            const update = await db.updatePassword(mail,password)
            return {status: 'OK', password: 'edited'}
        } else{
            return {status: 'Error', mail: 'did not match'}
        }
    }
    else if(mail == null){
        return {status: 'Error', template: 'incorrect'}
    }
    else{
        const checkDb = await db.checkWithMail(mail)
        if (checkDb){
            const mailMess = await mailMessages(mail, generateCode)
            const sessRed = await db.sessionReduction([mail,generateCode])
            return {status: true, mail: `${mail}`, code: 'sent'}
        } else {
            return {status: false, mail: `${mail}`}
        }
    }
}
module.exports = {
    registrationUser,
    confirmCode,
    ReductionPassword
}