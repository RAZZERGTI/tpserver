const { uploadPhoto } = require('../upload/uploadPhoto')
const { getToken } = require('../../getToken')
const { deletePhoto } = require('../delete/deleteFile')
const { checkField } = require('../../../database/db')
const tokenGet = () => {
	return new Promise(async (resolve, reject) => {
		await getToken().then(r => resolve(r))
	})
}
const swapLogo = async req => {
	return new Promise(async (resolve, reject) => {
		const idFolder = req.idAlbum
		const tok = await tokenGet()
		const idPastImage = await checkField(
			'albums',
			'idLogo',
			'idAlbum',
			idFolder
		)
		if (idPastImage.idLogo.length === 37) {
			await deletePhoto(tok, idPastImage.idLogo, idFolder, 'logo')
		}
		const idImage = await uploadPhoto(idFolder, tok, 'swap', 'logo')
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
