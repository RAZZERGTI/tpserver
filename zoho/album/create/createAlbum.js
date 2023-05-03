const { createFolder } = require('./folder/createFolder')
const { uploadPhoto } = require('../upload/uploadPhoto')
const { getToken } = require('../../getToken')

function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1)
	return Math.round(rand)
}

async function createAlbum(reqBody, token) {
	return new Promise(async (resolve, reject) => {
		let idFolderRandom = randomInteger(100000000, 999999999)
		console.log(reqBody)
		createFolder(idFolderRandom, token)
			.then(async idFolder => {
				const idImage = await uploadPhoto(
					idFolder,
					token,
					'create',
					'logo',
					reqBody
				)
				resolve({
					response: {
						idAlbum: idFolder,
						idLogo: idImage
					}
				})
			})
			.catch(error => {
				console.error(error)
			})
	})
}
module.exports = {
	createAlbum
}
