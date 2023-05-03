const fs = require('fs')
const getToken = require('../../getToken')
const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const { getTitle } = require('../../../database/db')
require('dotenv').config()

const url = 'eu'

const getAllFolders = async (req, token) => {
	return new Promise(async (resolve, reject) => {
		let reg = /\/\w+\/\w+\?\w+=?(\w+)/i
		let str = req.match(reg)
		let idUser = str[1]
		const zWDApi = new ZWorkDriveApi(token, url)
		zWDApi.folder
			.getAll({
				folderId: '60rn6f59db3cf57de4f57a55bb79dee48cb04',
				accessToken: token,
				domain: url
			})
			.then(async data => {
				if (data.length > 0) {
					const ids = data.map(item => item.id)
					let obj = await getTitle(ids, idUser)
					resolve(obj)
				} else {
					resolve({})
				}
			})
			.catch(async data => {
				console.log(data)
			})
	})
}

module.exports = {
	getAllFolders
}
