const { uploadPhoto } = require('../upload/uploadPhoto')
const { getToken } = require('../../getToken')
const tokenGet = () => {
	return new Promise(async (resolve, reject) => {
		await getToken().then(r => resolve(r))
	})
}
const uploadImages = async req => {
	return new Promise(async (resolve, reject) => {
		const idFolder = req.idAlbum
		const tok = await tokenGet()
		const res = await uploadPhoto(idFolder, tok, 'upload', 'photo')
		const filename = res.attributes.FileName
		const permalink = res.attributes.Permalink
		const idImage = res.attributes.resource_id
		resolve({
			response: {
				idPhoto: idImage,
				filename: filename,
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
