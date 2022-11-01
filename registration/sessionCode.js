const db = require('../database/db')
const registrationMailMessage = require('../mail/MailMessages')

async function sessionCode(table,row,mail,code){
    const regMail = await registrationMailMessage.mailMessages(mail, code)
    async function deleteCode() {
        await db.deleteDbCode(table,row,mail)
    }
    //3 Minutes
    setTimeout(deleteCode, 900000);
}

module.exports = {
    sessionCode
}