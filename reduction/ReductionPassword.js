const db = require('../database/db')
const { mailMessages } = require('../mail/MailMessages')
const { randomInteger } = require('../registration/createUser')

async function reductionPassword(href) {
	let reg = /\/\w+\/\w+\?(\w+)?=?(\w+@\w+.\w+)?&?(\w+)?=?(\w+)?/i
	let result = href.match(reg)
	let generateCode = randomInteger(10000, 99999)
	let mail = result[2]
	let hrefCodeOrPassword = result[3]
	let value = result[4]
	if (hrefCodeOrPassword === 'code') {
		const checkSessRedCode = await db.checkSessReductionCode(mail, value)
		if (checkSessRedCode) {
			return { response: true }
		} else {
			return {
				error: {
					statusCode: 401,
					name: 'unAuthorized',
					message: 'did not match'
				}
			}
		}
	} else if (hrefCodeOrPassword === 'password') {
		const checkSessRedCode = await db.infoCheckDb('reduction', 'mail', mail)
		if (checkSessRedCode) {
			const delSessRedCode = await db.deleteDbCode('reduction', 'mail', mail)
			const update = await db.updateField('users', 'password', value, mail)
			const checkDbUser = await db.returnCode('users', 'mail', mail)
			return {
				response: {
					id: checkDbUser.id,
					name: checkDbUser.name,
					mail: checkDbUser.mail
				}
			}
		} else {
			return {
				error: {
					statusCode: 401,
					name: 'unAuthorized',
					message: 'did not match'
				}
			}
		}
	} else if (mail == null) {
		return {
			error: {
				statusCode: 400,
				name: 'Bad request',
				message: 'incorrect request'
			}
		}
	} else {
		const checkDb = await db.infoCheckDb('users', 'mail', mail)
		let inRed = await db.infoCheckDb('reduction', 'mail', mail)
		if (inRed) {
			return {
				error: {
					statusCode: 401,
					name: 'Authorized',
					message: 'user already in session'
				}
			}
		} else {
			if (checkDb) {
				const mailMess = await mailMessages(mail, generateCode)
				const sessRed = await db.createSessionTable('reduction', [
					mail,
					generateCode
				])
				return { response: true }
			} else {
				return {
					error: {
						statusCode: 401,
						name: 'unAuthorized',
						message: 'user ins`t in dataBase'
					}
				}
			}
		}
	}
}

module.exports = {
	reductionPassword
}
