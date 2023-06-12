const nodemailer = require('nodemailer')
require('dotenv').config()
const mailUser = process.env.MAIL_USER
const mailPassword = process.env.MAIL_PASS
async function mailMessages(mail, code) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${mailUser}`,
			pass: `${mailPassword}`
		}
	})
	let mailOptions = {
		from: 'TaP - Take a Photo',
		to: `${mail}`,
		subject: 'Код подтверждения',
		text: `Ваш код - ${code}`
	}
	await transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error)
		}
	})
}
module.exports = {
	mailMessages
}
