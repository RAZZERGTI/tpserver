const fs = require('fs')
const getToken = require('../../getToken')
const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const {
	threeValues,
	updateLogo,
	updateIdImages
} = require('../../../database/db')
require('dotenv').config()

const url = 'eu'

const now = new Date()
let date = now
	.toLocaleString()
	.replace(/\./g, '-')
	.replace(/,/g, '_')
	.replace(/:/g, '-')
	.replace(/ /g, '')

const getPhotoFromDirectory = () => {
	return new Promise((resolve, reject) => {
		fs.readdir('images', (err, files) => {
			if (err) {
				reject(err)
			} else {
				if (files[0] !== null) {
					resolve(`images/${files[0]}`)
				}
			}
		})
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

const uploadFile = async (zWDApi, name, path, parent_id, token, action) => {
	return new Promise(async (resolve, reject) => {
		console.log('Path - ', path)
		console.log('READSTREAM - ', fs.createReadStream(path))
		zWDApi.files
			.upload({
				parentId: parent_id,
				name: name,
				overrideNameExist: 'false',
				readableStream: fs.createReadStream(path),
				accessToken: token,
				domain: url
			})
			.then(async data => {
				deleteFile(path)
				if (action === 'create') {
					await threeValues('albums', [
						`${parent_id}`,
						`${data[0].attributes.resource_id}`,
						' '
					])
					resolve(data[0].attributes.resource_id)
				} else if (action === 'swap') {
					await updateLogo('albums', data[0].attributes.resource_id, parent_id)
					resolve(data[0].attributes.resource_id)
				} else if (action === 'upload') {
					await updateIdImages(
						'albums',
						data[0].attributes.resource_id,
						parent_id
					)
					resolve(data[0])
				}
			})

			.catch(async data => {
				console.log(data)
				if (
					data.response.data.errors[0].title === 'Invalid OAuth token.' ||
					data.response.data.errors[0].title ===
						'Un-Authenticated user. Authorization check failed.'
				) {
					token = await getToken.getToken()
					await uploadPhoto()
				}
			})
	})
}

const uploadPhoto = async (parent_id, token, action, typePhoto) => {
	return new Promise(async (resolve, reject) => {
		try {
			const zWDApi = new ZWorkDriveApi(token, url)
			const filePath = await getPhotoFromDirectory()
			const extensionReg = filePath.match(/\.(jpg|jpeg|png)$/i)
			resolve(
				await uploadFile(
					zWDApi,
					`${typePhoto}_${date}.${extensionReg[1]}`,
					filePath,
					parent_id,
					token,
					action
				)
			)
		} catch (e) {
			console.log(e)
		}
	})
}

module.exports = {
	uploadPhoto
}
