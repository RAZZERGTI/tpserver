const db = require("../database/db");

async function authUser(href){
    let reg = /\/\w+\/\w+\?\w+=([a-z\d]+)&\w+=([a-z\d]+)/i
    let result = href.match(reg)
    if (result == null){
        return {
            "error": {
                "statusCode": 400,
                "name": "Bad request",
                "message": 'fields are empty'
            }}
    } else{
        let name = result[1]
        let password = result[2]
        let user = await db.checkDbUserAuth(name, password)
        if (user){
            return {id:user.id, name: user.name, mail: user.mail}
        }
        else{
            return{
                "error": {
                "statusCode": 401,
                    "name": "unAuthorized",
                    "message": 'user and password did not match'
            }}
        }
    }
}

module.exports = {
    authUser
}