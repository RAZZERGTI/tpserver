const https = require('https')
require('dotenv').config()
const fs = require('fs')

const refresh_token = process.env.REFRESH_TOKEN
const client_secret = process.env.CLIENT_SECRET
const client_id = process.env.CLIENT_ID

const options = {
	hostname: 'accounts.zoho.eu',
	path: '/oauth/v2/token',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}
async function getToken() {
	return new Promise((resolve, reject) => {
		const req = https.request(options, res => {
			res.on('data', d => {
				const response = JSON.parse(d)
				resolve(response.access_token)
			})
		})

		req.on('error', error => {
			console.error(error)
		})

		req.write(
			`refresh_token=${refresh_token}&client_secret=${client_secret}&grant_type=refresh_token&client_id=${client_id}`
		)

		req.end()
	})
}
module.exports = {
	getToken
}
