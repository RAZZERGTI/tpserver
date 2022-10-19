const db = require('../database/db')
const nodemailer = require("nodemailer");
async function sessionCode(arrCode){
    const createDbCode = await db.createDbCode(arrCode)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tpmobileapp12@gmail.com',
            pass: 'dimnyyjtzphcqxfi'
        }
    })
    let mailOptions = {
        from: 'TP - Take a Photo',
        to: `${arrCode[2]}`,
        subject: 'Код авторизации',
        text: `Вот ваш код - ${arrCode[4]}`
    }
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
    });
    async function deleteCode() {
        await db.deleteDbCode(arrCode)
    }
    setTimeout(deleteCode, 180000);
}
module.exports = {
    sessionCode
}