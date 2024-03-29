const db = require('../database/db')
const session = require('../registration/sessionCode')
function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1)
	return Math.round(rand)
}
async function registrationUser(href) {
	let validationNameAndMail = /\/\w+\/\w+\?([a-z]+)?=(\w+@?\w+\.?\w+)?/i
	let resultRegular = href.match(validationNameAndMail)
	let info = resultRegular[2]
	if (resultRegular[1] === 'name') {
		let reg =
			/\/\w+\/\w+\?([a-z]+)?=?([a-z\d]+)?&?([a-z]+)?=?([a-z\d-]+\.*[a-z\d_-]+@[a-z]+.[a-z]+)?&?([a-z]+)?=?([A-Za-z\d]+)?/i
		let result = href.match(reg)
		let name = result[2]
		let mail = result[4]
		let password = result[6]
		if (password != null) {
			let sessionCheck = await db.infoCheckDb('registration', 'name', name)
			let idUser = randomInteger(100000000, 999999999)
			let code = randomInteger(10000, 99999)
			if (sessionCheck) {
				await db.updateField('registration', 'code', code, mail)
				return {
					response: {
						id: idUser,
						name: name,
						mail: mail
					}
				}
			} else {
				const arrCode = [idUser, `${name}`, `${mail}`, `${password}`, code]
				const createDbCode = await db.createDbCode(arrCode)
				const sessCode = await session.sessionCode(
					'registration',
					'mail',
					mail,
					code
				)
				return {
					response: {
						id: idUser,
						name: name,
						mail: mail
					}
				}
			}
		} else if (mail != null) {
			return {
				error: {
					statusCode: 400,
					name: 'Bad request',
					message: 'fields are empty'
				}
			}
		} else {
			let users = await db.infoCheckDb('users', 'name', info)
			let session = await db.infoCheckDb('registration', 'name', info)
			if (users || session) {
				return {
					response: false
				}
			} else {
				return {
					response: true
				}
			}
		}
	} else if (resultRegular[1] === 'mail') {
		let users = await db.infoCheckDb('users', 'mail', info)
		let session = await db.infoCheckDb('registration', 'mail', info)
		if (users || session) {
			return {
				response: false
			}
		} else {
			return {
				response: true
			}
		}
	} else {
		return {
			error: {
				statusCode: 400,
				name: 'Bad request',
				message: 'Change parameters'
			}
		}
	}
}
module.exports = {
	registrationUser,
	randomInteger
}
