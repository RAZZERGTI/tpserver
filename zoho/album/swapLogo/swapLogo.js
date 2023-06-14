const { uploadPhoto } = require('../upload/uploadPhoto')
const { getToken } = require('../../getToken')
const { deletePhoto } = require('../delete/deleteFile')
const { checkField } = require('../../../database/db')

const swapLogo = async (req, token) => {
	return new Promise(async (resolve, reject) => {
		const idFolder = req.idAlbum
		const idPastImage = await checkField(
			'albums',
			'idLogo',
			'idAlbum',
			idFolder
		)
		if (idPastImage.idLogo.length === 37) {
			await deletePhoto(token, idPastImage.idLogo, idFolder, 'logo')
		}
		const idImage = await uploadPhoto(idFolder, token, 'swap', 'logo')
		resolve({
			response: {
				idAlbum: idFolder,
				idLogo: idImage
			}
		})
	}).catch(error => {
		console.error(error)
	})
}
module.exports = {
	swapLogo
}
