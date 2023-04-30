const { uploadPhoto } = require('../upload/uploadPhoto')

const uploadImages = async (req, token) => {
	return new Promise(async (resolve, reject) => {
		const idFolder = req.idAlbum
		const res = await uploadPhoto(idFolder, token, 'upload', 'photo')
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
