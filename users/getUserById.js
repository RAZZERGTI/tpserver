const { checkField } = require('../database/db')
const getUserById = async idUserProps => {
	const infos = await checkField('users', '*', 'id', idUserProps)
	if (infos) {
		return {
			id: infos.id,
			name: infos.name,
			mail: infos.mail
		}
	} else {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error'
			}
		}
	}
}

module.exports = {
	getUserById
}
