const fs = require('fs')
const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const { getTitle, returnCode } = require('../../../database/db')
require('dotenv').config()
const parent_id = process.env.PARENT_ID_TAP

const url = 'eu'

const getInfoAlbumById = async idAlbum => {
	return await returnCode('albums', 'idAlbum', idAlbum)
}

module.exports = {
	getInfoAlbumById
}
