const ZWorkDriveApi = require('../../../zoho-workdrive-api')
const { updateDelete, deleteRow } = require('../../../database/db')

const url = 'eu'
const moveToTrash = async (zWDApi, resource_id, token) => {
	try {
		return new Promise((resolve, reject) => {
			zWDApi.files
				.moveTrash({
					idArr: [`${resource_id}`],
					accessToken: token,
					domain: url
				})
				.then(data => {
					resolve(data)
				})
		})
	} catch (e) {
		return e
	}
}

const deleteFile = async (zWDApi, resource_id, token) => {
	try {
		return new Promise((resolve, reject) => {
			zWDApi.files
				.delete({
					idArr: [`${resource_id}`],
					accessToken: token,
					domain: url
				})
				.then(data => {
					resolve(data)
				})
		})
	} catch (e) {
		return e
	}
}
const deletePhoto = async (token, id, parent_id, action) => {
	try {
		if (id) {
			const zWDApi = new ZWorkDriveApi(token, url)
			await moveToTrash(zWDApi, id, token)
			await deleteFile(zWDApi, id, token)
			if (action === 'photo') {
				await updateDelete('albums', id, 'idImages', parent_id)
			} else if (action === 'logo') {
				await updateDelete('albums', id, 'idLogo', parent_id)
			} else {
				return false
			}
		} else {
			const zWDApi = new ZWorkDriveApi(token, url)
			await moveToTrash(zWDApi, parent_id, token)
			await deleteFile(zWDApi, parent_id, token)
			if (action === 'album') {
				await deleteRow('albums', 'idAlbum', parent_id)
			} else {
				return false
			}
		}
	} catch (e) {
		return e
	}
}
module.exports = {
	deletePhoto
}
