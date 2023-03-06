const axios = require('axios')
require('dotenv').config()
const username = process.env.TERA_GMAIL
const password = process.env.TERA_PASS

const getToken = async () => {
	return new Promise(async (resolve, reject) => {
		const response = await axios.post(
			'https://www.terabox.com/api/oauth/token',
			{
				grant_type: 'password',
				username: username,
				password: password
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
		console.log(response.data.access_token)
	})
}
const token = getToken()
console.log(token)
