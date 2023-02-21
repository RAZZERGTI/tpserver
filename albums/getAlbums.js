const getAlbums = url => {
	let pattern = /\/\w+\/\w+\?([a-z]+)=([0-9]+)/i
	let result = url.match(pattern)

	console.log(result[2])
}
module.exports = {
	getAlbums
}
