const { uploadPhoto } = require('../upload/uploadPhoto')

const uploadImages = async (req, token) => {
	return new Promise(async (resolve, reject) => {
		const idFolder = req.idAlbum
<<<<<<< HEAD
		const res = await uploadPhoto(idFolder, token, 'upload', 'photo')
=======
		const tok = await tokenGet()
		const res = await uploadPhoto(idFolder, tok, 'upload', 'photo')
>>>>>>> b864ce031b18151e47892b549bc7e8d0c54a0615
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
