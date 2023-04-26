const { createFolder } = require('./folder/createFolder')
const { uploadPhoto } = require('../upload/uploadPhoto')
const { getToken } = require('../../getToken')

const tokenGet = () => {
	return new Promise(async (resolve, reject) => {
		await getToken().then(r => resolve(r))
	})
}

function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1)
	return Math.round(rand)
}

async function createAlbum(reqBody) {
	return new Promise(async (resolve, reject) => {
		console.log(reqBody.id)
		console.log(reqBody.albumName)
		let idFolderRandom = randomInteger(100000000, 999999999)
		const tok = await tokenGet()
		createFolder(idFolderRandom, tok)
			.then(async idFolder => {
				const idImage = await uploadPhoto(
					idFolder,
					tok,
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
