const db = require('../database/db')
const createFolder = require('../mega/upload-photo')

async function confirmCodeReg(href) {
	let pattern = /\/\w+\/\w+\?([a-z]+)=(\d+)&([a-z]+)=(\d+)/i
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
		let id = result[2]
		let code = result[4]
		let sessCode = await db.returnCode('registration', 'id', id)
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
			if (`${sessCode.code}` === code && `${sessCode.id}` === id) {
				const record = await db.recordingUser(array)
				const createFolderMega = createFolder.createFolder(sessCode.id)
				const del = await db.deleteDbCode('registration', 'mail', sessCode.mail)
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
