const db = require('../database/db')
const session = require('../registration/sessionCode')
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
async function registrationUser(href){
    let reg = /\/\w+\/\w+\?([a-z]+)?=?([a-z\d]+)?&?([a-z]+)?=?([a-z\d-]+\.*[a-z\d_-]+@[a-z]+.[a-z]+)?&?([a-z]+)?=?([A-Za-z\d]+)?/i
    let result = href.match(reg)
    if (result == null){
        return {
            "error": {
                "statusCode": 400,
                "name": "Bad request",
                "message": 'fields are empty'
            }}
    }
    else {
        let name = result[2]
        let mail = result[4]
        let password = result[6]
        if (name == null){
            return {
                "error": {
                    "statusCode": 400,
                    "name": "Bad request",
                    "message": 'fields are empty'
                }}
        }
        else if(mail == null){
            let users = await db.usersCheckDbUser(name)
            let session = await db.sessionCheckDbUser(name)
            if (users || session){
                return {
                    response: false
                }
            }
            else{
                return {
                    response: true
                }
            }
        }
        else if(password == null){
            let users = await db.usersCheckDbMail(mail)
            let session = await db.sessionCheckDbMail(mail)
            if (users || session){
                return {
                    response: false
                }
            }
            else{
                return {
                    response: true
                }
            }
        }
        else{
            let session = await db.sessionCheckDbUser(name)
            if(session) {
                return {"error": {
                    "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'user already in session'
                }}
            }
            else{
                let idUser = randomInteger(100000000, 999999999)
                let code = randomInteger(10000, 99999)
                const arrCode = [idUser, `${name}`, `${mail}`, `${password}`, code]
                const sessCode = await session.sessionCode(arrCode)
                return {
                    id: idUser,
                    name: name,
                    mail: mail
                }
            }
        }
    }
}

module.exports = {
    registrationUser,
    randomInteger
}
