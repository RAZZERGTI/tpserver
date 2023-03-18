require('dotenv').config()
const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URI = process.env.REDIRECT_URI
const ZUID = process.env.ZUID
function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1)
	return Math.round(rand)
}
const fs = require('fs')
const url = 'eu'
const access_token =
	'1000.93b5475d0ab2270657d83493b2cfa4d7.2c34da41e4430512c6407287b7095225'
const ZWorkDriveApi = require('../zoho-workdrive-api/lib')
const zWDApi = new ZWorkDriveApi(access_token, url)
async function uploadPhoto() {
	fs.readdir('images', (err, files) => {
		if (err) {
			console.log(err)
		} else {
			console.log(files[0])
			let path = `images/${files[0]}`
			uploadFile(files[0], path)
			setTimeout(deleteFile, 2000, path)
		}
	})
	const uploadFile = async (name, path) => {
		zWDApi.files
			.upload({
				parentId: '3fa50f9de0ae39c9c4bdb98a4e465317a7f03',
				name: name,
				overrideNameExist: 'false',
				readableStream: fs.createReadStream(path),
				accessToken: access_token,
				domain: url
			})
			.then(data => {
				console.log(data)
			})
	}

	const deleteFile = path => {
		fs.unlink(path, err => {
			if (err) {
				console.log(err)
			} else {
				console.log('File deleted!')
			}
		})
	}
}
module.exports = {
	uploadPhoto
}
