const db = require("../database/db");

async function authUser(href){
    let reg = /\/\w+\/\w+\?\w+=([a-z\d]+)&\w+=([a-z\d]+)/i
    let result = href.match(reg)
    if (result == null){
        return {status: '400 Bad Request'}
    } else{
        let name = result[1]
        let password = result[2]
        let user = await db.checkDbUserAuth(name, password)
        if (user){
            return {status: '200 OK', data: 'coincided'}
        }
        else{
            return {status: '205 Reset Content', Error: 'user and password did not match'}
        }
    }
}

module.exports = {
    authUser
}