const getAlbums = url => {
	let pattern = /\/\w+\?[a-z]+_[a-z]+=([0-9]+)&[a-z]+_[a-z]+=([0-9]+)/i
	let result = url.match(pattern)
	console.log(result[1])
	console.log(result[2])
	const idUser = result[1]
	const idAlbum = result[2]
}
module.exports = {
	getAlbums
}
