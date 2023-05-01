const fs = require('fs')
const getToken = require('../../getToken')
const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const { getTitle } = require('../../../database/db')
require('dotenv').config()

const url = 'eu'

const getAllFolders = async token => {
	return new Promise(async (resolve, reject) => {
		const zWDApi = new ZWorkDriveApi(token, url)
		zWDApi.folder
			.getAll({
				folderId: '60rn6f59db3cf57de4f57a55bb79dee48cb04',
				accessToken: token,
				domain: url
			})
			.then(async data => {
				const ids = data.map(item => item.id)
				let obj = await getTitle(ids)
				resolve(obj)
			})

			.catch(async data => {
				console.log(data)
			})
	})
}

module.exports = {
	getAllFolders
}
