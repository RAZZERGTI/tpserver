const db = require("../database/db");

async function confirmCodeAuth(resultHref){
    let mail = resultHref[2]
    let code = resultHref[4]
    let dbCode = await db.returnCodeAuth(mail)
    if (dbCode){
        if (Number(code) === dbCode.code){
            let deleteCode = await db.deleteDbCode('authorization','mail',mail)
            return{
                response: true
            }
        }
        else {
            return {
                response: false
            }
        }
    } else {
        return {
            "error": {
                "statusCode": 400,
                "name": "Bad request",
                "message": 'user isn`t in session'
            }
        }
    }
}

module.exports = {
    confirmCodeAuth
}