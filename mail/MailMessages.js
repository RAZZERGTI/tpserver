const nodemailer = require("nodemailer");
async function mailMessages(mail, code){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tpmobileapp12@gmail.com',
            pass: 'dimnyyjtzphcqxfi'
        }
    })
    let mailOptions = {
        from: 'TP - Take a Photo',
        to: `${mail}`,
        subject: 'Код авторизации',
        text: `Вот ваш код - ${code}`
    }
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
    });
}
module.exports = {
    mailMessages
}