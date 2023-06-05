const { returnCode } = require('../../../database/db')
require('dotenv').config()

const getInfoAlbumById = async idAlbum => {
	return await returnCode('albums', 'idAlbum', idAlbum)
}

module.exports = {
	getInfoAlbumById
}
