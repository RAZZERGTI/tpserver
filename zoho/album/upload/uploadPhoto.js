const fs = require('fs')
const getToken = require('../../getToken')
const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const {
	updateLogo,
	updateIdImages,
	sixValues,
	fourValues
} = require('../../../database/db')
require('dotenv').config()

const url = 'eu'

const getPhotoFromDirectory = fileName => {
	return new Promise((resolve, reject) => {
		fs.readdir('images', (err, files) => {
			if (err) {
				reject(err)
			} else {
				if (files[0] !== null) {
					files.map(file => {
						if (file === fileName) {
							resolve(`images/${file}`)
						}
					})
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

const uploadFile = async (
	zWDApi,
	name,
	path,
	parent_id,
	token,
	action,
	reqBody
) => {
	return new Promise(async (resolve, reject) => {
		console.log(date)
		console.log(name)
		zWDApi.files
			.upload({
				parentId: parent_id,
				name: name,
				overrideNameExist: 'true',
				readableStream: fs.createReadStream(path),
				accessToken: token,
				domain: url
			})
			.then(async data => {
				deleteFile(path)
				if (action === 'create') {
					await sixValues('albums', [
						`${parent_id}`,
						reqBody.idUser,
						reqBody.AlbumName,
						reqBody.frame,
						`${data[0].attributes.resource_id}`,
						' ',
						' '
					])
					resolve(data[0].attributes.resource_id)
				} else if (action === 'swap') {
					await updateLogo('albums', data[0].attributes.resource_id, parent_id)
					resolve(data[0].attributes.resource_id)
				} else if (action === 'upload') {
					const idUser = reqBody.idUser
					const caption = reqBody.caption
					await fourValues('photos', [
						data[0].attributes.resource_id,
						idUser,
						parent_id,
						caption
					])
					await updateIdImages(
						'albums',
						data[0].attributes.resource_id,
						parent_id
					)
					resolve(data[0])
				}
			})

			.catch(async data => {
				if (data) {
					token = await getToken.getToken()
					await uploadPhoto()
				}
			})
	})
}

const uploadPhoto = async (
	parent_id,
	token,
	action,
	typePhoto,
	reqBody,
	fileName
) => {
	return new Promise(async (resolve, reject) => {
		try {
			let date = new Date()
	.toLocaleString('en-US', {
		hour12: false,
		timeZone: 'Europe/Minsk'
	})
	.replace(/\./g, '-')
	.replace(/,/g, '_')
	.replace(/:/g, '-')
	.replace(/ /g, '')
			const zWDApi = new ZWorkDriveApi(token, url)
			const filePath = await getPhotoFromDirectory(fileName)
			const extensionReg = filePath.match(/\.(jpg|jpeg|png)$/i)
			if (extensionReg) {
				resolve(
					await uploadFile(
						zWDApi,
						`${typePhoto}_${date}.${extensionReg[1]}`,
						filePath,
						parent_id,
						token,
						action,
						reqBody
					)
				)
			} else {
				resolve(false)
			}
		} catch (e) {
			console.log(e)
		}
	})
}

module.exports = {
	uploadPhoto
}
