const { uploadPhoto } = require('../upload/uploadPhoto')

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
		const permalink = res.attributes.Permalink
		const idImage = res.attributes.resource_id
		resolve({
			response: {
				idPhoto: idImage,
				permalink: permalink
			}
		})
	}).catch(error => {
		console.error(error)
	})
}
module.exports = {
	uploadImages
}
