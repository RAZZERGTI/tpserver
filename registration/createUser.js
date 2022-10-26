const db = require('../database/db')
const session = require('../registration/sessionCode')
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
async function registrationUser(href){
    let reg = /\/\w+\/\w+\?([a-z]+)=([a-z\d]+)&([a-z]+)=([a-z\d-]+\.*[a-z\d_-]+@[a-z]+.[a-z]+)&([a-z]+)=([A-Za-z\d]+)/i
    let result = href.match(reg)
    if (result == null){
        return {status: '400 Bad Request'}
    }
    else {
        let name = result[2]
        let mail = result[4]
        let password = result[6]
        let user = await db.checkDbUser(name)
        let mailCheck = await db.checkDbMail(mail)
        if (user) {
            return {status: '205 Reset Content', Error: 'name taken'}
        } else if (mailCheck) {
            return {status: '205 Reset Content', Error: 'mail taken'}
        } else {
            let idUser = randomInteger(100000000, 999999999)
            let code = randomInteger(10000, 99999)
            const arrCode = [idUser, `${name}`, `${mail}`, `${password}`, code]
            const sessCode = await session.sessionCode(arrCode)
            return {
                status: '200 OK',
                id: idUser
            }
        }
    }
}

module.exports = {
    registrationUser,
    randomInteger
}