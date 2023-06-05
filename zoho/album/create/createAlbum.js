const { createFolder } = require('./folder/createFolder')
const { uploadPhoto } = require('../upload/uploadPhoto')
const { getToken } = require('../../getToken')
const { sixValues } = require('../../../database/db')

function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1)
	return Math.round(rand)
}

async function createAlbum(reqBody, token, fileName) {
	return new Promise(async (resolve, reject) => {
		let idFolderRandom = randomInteger(100000000, 999999999)
		createFolder(idFolderRandom, token)
			.then(async idFolder => {
				if (!fileName) {
					await sixValues('albums', [
						`${idFolder}`,
						reqBody.idUser,
						reqBody.AlbumName,
						reqBody.frame,
						'',
						'',
						''
					])
					resolve({
						response: {
							idAlbum: idFolder
						}
					})
				} else {
					const idImage = await uploadPhoto(
						idFolder,
						token,
						'create',
						'logo',
						reqBody,
						fileName
					)
					resolve({
						response: {
							idAlbum: idFolder,
							idLogo: idImage
						}
					})
				}
			})
			.catch(error => {
				console.error(error)
			})
	})
}
module.exports = {
	createAlbum
}
