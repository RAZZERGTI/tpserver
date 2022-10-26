const db = require("../database/db");

async function confirmCode(href){
    let pattern = /\/\w+\/\w+\?([a-z]+)=(\d+)&([a-z]+)=(\d+)/i
    let result = href.match(pattern)
    if (result == null){
        return {status: '400 Bad Request'}
    }
    else {
        let id = result[2]
        let code = result[4]
        let sessCode = await db.checkDbCode(id)
        if (sessCode == null) {
            return {status: '205 Reset Content', code: 'did not match'}
        } else {
            let array = [sessCode.id, sessCode.name, sessCode.mail, sessCode.password]
            if (`${sessCode.code}` === code && `${sessCode.id}` === id) {
                const record = await db.recordingUser(array)
                const del = await db.deleteDbCode(array)
                return {status: 'OK', code: 'coincided'}
            } else {
                return {status: '205 Reset Content', code: 'did not match'}
            }
        }
    }
}

module.exports = {
    confirmCode
}