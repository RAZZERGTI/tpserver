function createAlbum(req) {
	console.log(req)
	const albumNameLog = JSON.parse(req.AlbumName)
	console.log('ID - ', albumNameLog.id)
	console.log('AlbumName - ', albumNameLog.albumName)
}
module.exports = {
	createAlbum
}
