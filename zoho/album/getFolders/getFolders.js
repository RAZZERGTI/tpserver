const fs = require('fs')
const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const { getTitle } = require('../../../database/db')
require('dotenv').config()
const parent_id = process.env.PARENT_ID_TAP

const url = 'eu'

const getAllFolders = async (req, token) => {
	return new Promise(async (resolve, reject) => {
		let reg = /\/\w+\/\w+\?\w+=?(\w+)/i
		let str = req.match(reg)
		let idUser = str[1]
		const zWDApi = new ZWorkDriveApi(token, url)
		zWDApi.folder
			.getAll({
				folderId: parent_id,
				accessToken: token,
				domain: url
			})
			.then(async data => {
				if (data.length > 0) {
					const ids = data.map(item => item.id)
					console.log(ids)
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
