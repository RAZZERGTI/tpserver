const db = require('../database/db')
const registrationMailMessage = require('../mail/MailMessages')

async function sessionCode(arrCode){
    const createDbCode = await db.createDbCode(arrCode)
    const regMail = await registrationMailMessage.mailMessages(arrCode[2], arrCode[4])
    async function deleteCode() {
        await db.deleteDbCode(arrCode)
    }
    //3 Minutes
    setTimeout(deleteCode, 180000);
}

module.exports = {
    sessionCode
}