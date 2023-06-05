const { uploadPhoto } = require('../upload/uploadPhoto')
const { fourValues } = require('../../../database/db')

const uploadImages = async (req, token, fileName) => {
	return new Promise(async (resolve, reject) => {
		const idFolder = req.idAlbum
		const res = await uploadPhoto(
			idFolder,
			token,
			'upload',
			'photo',
			req,
			fileName
		)
		const idImage = res.attributes.resource_id
		resolve({
			idPhoto: idImage
		})
	}).catch(error => {
		console.error(error)
	})
}
module.exports = {
	uploadImages
}
