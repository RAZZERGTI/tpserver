const db = require('../database/db')

async function confirmCodeReg(href) {
	let pattern = /\/\w+\/\w+\?[a-z]+=(\w+@?\w+\.?\w+)&[a-z]+=(\d+)/i
	let result = href.match(pattern)
	if (result == null) {
		return {
			error: {
				statusCode: 400,
				name: 'Bad request',
				message: 'fields are empty'
			}
		}
	} else {
		let mail = result[1]
		let code = result[2]
		let sessCode = await db.returnCode('registration', 'mail', mail)
		if (sessCode == null) {
			return {
				error: {
					statusCode: 401,
					name: 'unAuthorized',
					message: 'did not match'
				}
			}
		} else {
			let array = [sessCode.id, sessCode.name, sessCode.mail, sessCode.password]
			if (`${sessCode.code}` === code && `${sessCode.mail}` === mail) {
				const record = await db.recordingUser(array)
				const del = await db.deleteRow('registration', 'mail', sessCode.mail)
				return { response: true }
			} else {
				return { response: false }
			}
		}
	}
}

module.exports = {
	confirmCodeReg
}
