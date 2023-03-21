require('dotenv').config()
const parent_ID = process.env.PARENT_ID_TAP
const axios = require('axios')

const createFolder = (folderName, token) => {
	const headers = {
		Authorization: `Zoho-oauthtoken ${token}`
	}

	const data = {
		data: {
			attributes: {
				name: `${folderName}`,
				parent_id: parent_ID
			},
			type: 'files'
		}
	}

	return axios
		.post('https://www.zohoapis.eu/workdrive/api/v1/files', data, { headers })
		.then(response => {
			return response.data.data.id
		})
		.catch(error => {
			console.error(error)
			console.log(error.response.data.errors[0].title)
		})
}

module.exports = {
	createFolder
}
