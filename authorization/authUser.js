const db = require("../database/db");

async function authUser(href){
    let validationNameAndMail = /\/\w+\/\w+\?([a-z]+)?=(\w+@?\w+\.?\w+)?&?(\w+)?=?(\w+)?/i
    let resultRegular = href.match(validationNameAndMail)
    console.log(resultRegular)
    let nameOrMail = resultRegular[2]
    let password = resultRegular[4]
    if (resultRegular == null) {
        return {
            "error": {
                "statusCode": 400,
                "name": "Bad request",
                "message": 'fields are empty'
            }
        }
    }
    else if (resultRegular[1] === 'name') {
        let user = await db.checkDbUserAuth(nameOrMail, password)
        if (user) {
            return {
                response: {
                    id: user.id,
                    name: user.name,
                    mail: user.mail
                }
            }
        }
    }
    else if(resultRegular[1] === 'mail') {
        let mail = await db.checkDbMailAuth(nameOrMail, password)
        if (mail) {
            return {
                response: {
                    id: mail.id,
                    name: mail.name,
                    mail: mail.mail
                }
            }
        }
    }
    else {
        return{
            "error": {
                "statusCode": 401,
                "name": "unAuthorized",
                "message": 'user and password did not match'
            }}
    }
}

module.exports = {
    authUser
}