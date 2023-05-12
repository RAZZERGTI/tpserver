const { getPhotosByAlbumId } = require('../../../database/db')

const getPhotosByAlbum = async (token, album_id) => {
	let obj = await getPhotosByAlbumId(album_id)
	console.log(obj)
	return obj
}

module.exports = {
	getPhotosByAlbum
}
