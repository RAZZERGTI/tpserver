const db = require('../database/db')
const mailMessage = require('../mail/MailMessages')
const createCode = require('../registration/createUser')
const session = require('../registration/sessionCode')
const confirmCodeAuth = require('./confirmCodeAuth')
const { updateField } = require('../database/db')

async function authUser(href) {
	let validationNameAndMail =
		/\/\w+\/\w+\?([a-z]+)?=(\w+@?\w+\.?\w+)?&?(\w+)?=?(\w+)?/i
	let resultRegular = href.match(validationNameAndMail)
	let nameOrMail = resultRegular[2]
	let password = resultRegular[4]
	if (resultRegular == null) {
		return {
			error: {
				statusCode: 400,
				name: 'Bad request',
				message: 'fields are empty'
			}
		}
	} else if (resultRegular[1] === 'name') {
		let user = await db.checkDbUserAuth('name', nameOrMail, password)
		let inAuth = await db.infoCheckDb('authorization', 'mail', user.mail)
		if (inAuth) {
			return {
				error: {
					statusCode: 401,
					name: 'Authorized',
					message: 'user already in session'
				}
			}
		} else {
			if (user) {
				let code = createCode.randomInteger(10000, 99999)
				const sessCode = await session.sessionCode(
					'registration',
					'mail',
					user.mail,
					code
				)
				let authSession = await db.createSessionTable('authorization', [
					user.mail,
					code
				])
				return {
					response: {
						id: user.id,
						name: user.name,
						mail: user.mail
					}
				}
			} else {
				return {
					error: {
						statusCode: 401,
						name: 'unAuthorized',
						message: 'user and password did not match'
					}
				}
			}
		}
	} else if (resultRegular[1] === 'mail') {
		if (resultRegular[3] === 'code') {
			return await confirmCodeAuth.confirmCodeAuth(resultRegular)
		} else {
			let mailCheck = await db.checkDbUserAuth('mail', nameOrMail, password)
			let inAuth = await db.infoCheckDb('authorization', 'mail', nameOrMail)
			if (inAuth) {
				let code = createCode.randomInteger(10000, 99999)
				let updateCode = await updateField(
					'authorization',
					'code',
					code,
					nameOrMail
				)
				return {
					response: {
						id: mailCheck.id,
						name: mailCheck.name,
						mail: mailCheck.mail
					}
				}
			} else {
				if (mailCheck) {
					let code = createCode.randomInteger(10000, 99999)
					const mailMess = await mailMessage.mailMessages(mailCheck.mail, code)
					let authSession = await db.createSessionTable('authorization', [
						mailCheck.mail,
						code
					])
					return {
						response: {
							id: mailCheck.id,
							name: mailCheck.name,
							mail: mailCheck.mail
						}
					}
				} else {
					return {
						error: {
							statusCode: 401,
							name: 'unAuthorized',
							message: 'user and password did not match'
						}
					}
				}
			}
		}
	} else {
		return {
			error: {
				statusCode: 401,
				name: 'unAuthorized',
				message: 'user and password did not match'
			}
		}
	}
}

module.exports = {
	authUser
}
