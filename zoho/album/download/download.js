const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const fs = require('fs')

const url = 'eu'

const downloadFile = async (zWDApi, resource_id, token) => {
	return new Promise((resolve, reject) => {
		zWDApi.files
			.download({
				fileId: resource_id,
				accessToken: token,
				domain: url
			})
			.then(data => {
				console.log(data)
				fs.writeFile('image.jpg', `${data}`, 'base64', err => {
					if (err) throw err
					console.log('The file has been saved!')
				})
				resolve(data)
			})
	})
}
const downloadPhoto = async (token, resource_id) => {
	try {
		const zWDApi = new ZWorkDriveApi(token, url)
		await downloadFile(zWDApi, resource_id, token)
	} catch (e) {
		console.log(e)
	}
}
module.exports = {
	downloadPhoto
}
