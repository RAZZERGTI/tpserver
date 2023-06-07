const express = require('express')
const app = express()
const port = 3001
const pid = process.pid

const fs = require('fs')
const swaggerUi = require('swagger-ui-express')
const createAlbum = require('./zoho/album/create/createAlbum')
const upload = require('./helpers/multer_config').upload
const { getToken } = require('./zoho/getToken')
const { deletePhoto } = require('./zoho/album/delete/deleteFile')
const { swapLogo } = require('./zoho/album/swapLogo/swapLogo')
const createUser = require('./registration/createUser')
const authUser = require('./authorization/authUser')
const confirmCodeReg = require('./registration/confirmCodeReg')
const reduction = require('./reduction/reductionPassword')
const repeatCode = require('./repeat/repeatCode')
const { uploadImages } = require('./zoho/album/upload/upload')
const { downloadPhoto } = require('./zoho/album/download/download')
const { getAllFolders } = require('./zoho/album/getFolders/getFolders')
const { getPhotosByAlbum } = require('./zoho/album/getPhotos/getPhotosByAlbum')
const cors = require('cors')
const { getUserById } = require('./users/getUserById')
const bodyParser = require('body-parser')
const {
	setTitleById,
	fourValues,
	getCaption,
	getFeelById
} = require('./database/db')
const {
	getInfoAlbumById
} = require('./zoho/album/getInfoAlbumById/getInfoAlbumById')
const { downloadZipAlbum } = require('./zoho/album/downloadZip/downloadZip')
getToken()

const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'))

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(cors(), bodyParser.json())

app.get('/api/registration?', async function (req, res) {
	try {
		let url = `${req.originalUrl}`
		const create = await createUser.registrationUser(url)
		res.send(create)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.put('/editTitle/:album_id', async (req, res) => {
	try {
		const albumId = req.params.album_id
		const requestBody = req.body.body
		const parsedBody = JSON.parse(requestBody)
		const newTitle = parsedBody.title
		await setTitleById(newTitle, albumId)
		res.status(200).json({ message: 'Название альбома успешно изменено.' })
	} catch (e) {
		console.log(e)
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.get('/api/getUserById/:userId', async function (req, res) {
	try {
		const { userId } = req.params
		const getInfo = await getUserById(userId)
		res.send(getInfo)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})
app.get('/api/authorization?', async function (req, res) {
	try {
		let url = `${req.originalUrl}`
		const auth = await authUser.authUser(url)
		res.send(auth)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.get('/api/checkCode?', async function (req, res) {
	try {
		let url = `${req.originalUrl}`
		const confirmCoding = await confirmCodeReg.confirmCodeReg(url)
		res.send(confirmCoding)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.get('/api/reductionPassword?', async function (req, res) {
	try {
		let url = `${req.originalUrl}`
		const redPass = await reduction.reductionPassword(url)
		res.send(redPass)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.get('/api/repeatCode?', async function (req, res) {
	try {
		let url = `${req.originalUrl}`
		const repeat = await repeatCode.repeatCode(url)
		res.send(repeat)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

let token

async function getTokenAndUpdate() {
	try {
		token = await getToken()
	} catch (error) {
		console.error(`Error updating token: ${error}`)
	}
	setTimeout(getTokenAndUpdate, 59 * 60 * 1000) // запускаем функцию через 59 минут
}

getTokenAndUpdate()

app.get('/api/getInfoAlbumById/:album_id', async function (req, res) {
	try {
		const { album_id } = req.params
		let getAll = await getInfoAlbumById(album_id)
		res.send(getAll)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.get('/api/getAllAlbums?', async function (req, res) {
	try {
		console.log(token)
		let url = `${req.originalUrl}`
		let getAll = await getAllFolders(url, token)
		res.send(getAll)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})

app.get('/api/download/:resource_id', async function (req, res) {
	try {
		let date = new Date()
			.toLocaleString('en-US', {
				hour12: false,
				timeZone: 'Europe/Minsk'
			})
			.replace(/\./g, '-')
			.replace(/,/g, '_')
			.replace(/:/g, '-')
			.replace(/ /g, '')
		const { resource_id } = req.params
		const download = await downloadPhoto(token, resource_id)
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=photo_${date}.${download.extension}`
		)
		res.setHeader('Content-Type', `image/${download.extension}`)
		res.send(download.data)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})
app.get('/api/getFeel/:idUser', async function (req, res) {
	try {
		const { idUser } = req.params
		const getFeel = await getFeelById(idUser)
		res.send(getFeel)
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})
app.get('/api/getPhotoByAlbum/:resource_id', async function (req, res) {
	try {
		const { resource_id } = req.params
		const getPhotos = await getPhotosByAlbum(token, resource_id)
		let arr = getPhotos.idImages
			.split(' ')
			.filter(element => element !== '')
			.reverse()
		res.send(await getCaption(arr))
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})
app.get('/api/downloadZip/:resource_id', async function (req, res) {
	try {
		const { resource_id } = req.params
		console.log(token)
		// const downloadZip = await downloadZipAlbum(token, resource_id)

		// res.send(await getCaption(arr))
	} catch (e) {
		return {
			error: {
				statusCode: 500,
				name: 'Internal Server Error',
				message: `${e}`
			}
		}
	}
})
// const example = require('./posts/Example-CreateAlbum')
app.post(
	'/api/createAlbum',
	upload.array('imageUploads', 10),
	async (req, res) => {
		try {
			const senderName = req.body.fromName
			const fileNames = req.files.map(file => file.originalname)
			if (senderName == null) {
				res.status(500).json({ error: `No senderName sent.` })
				return
			}
			if (req.files == null) {
				res
					.status(500)
					.json({ error: `${senderName} - Image uploads not found.` })
			} else if (req.files.length === 0) {
				const create = await createAlbum.createAlbum(req.body, token, false)
				res.send(create)
			} else {
				const create = await createAlbum.createAlbum(
					req.body,
					token,
					fileNames[0]
				)
				res.send(create)
			}
		} catch (e) {
			res.send(e)
		}
	}
)

app.post('/api/sendReport', async (req, res) => {
	try {
		const { idPhoto, idAlbum, idUser, indexReport } = req.body
		console.log(idPhoto, idAlbum, idUser, indexReport)
		await fourValues('reports', [idPhoto, idUser, idAlbum, indexReport])
		res.send({
			response: true
		})
	} catch (error) {
		// Обработка ошибок, если таковые возникли при выполнении операций
		console.error('Ошибка при обработке запроса:', error)
		res.status(500).json({ error: 'Внутренняя ошибка сервера.' })
	}
})
// const example = require('./posts/Example-Upload')
app.post(
	'/api/uploadPhoto',
	upload.array('imageUploads', 10),
	async (req, res) => {
		try {
			const senderName = req.body.fromName
			const fileNames = req.files.map(file => file.originalname)
			if (senderName == null) {
				res.status(500).json({ error: `No senderName sent.` })
				return
			}
			if (req.files == null) {
				res
					.status(500)
					.json({ error: `${senderName} - Image uploads not found.` })
			} else if (req.files.length === 0) {
				res.status(500).json({ error: `${senderName} - No images sent.` })
			} else {
				const uploadPhoto = await uploadImages(req.body, token, fileNames[0])
				res.send(uploadPhoto)
			}
		} catch (e) {
			res.send(e)
		}
	}
)

// const exampleLogo = require('./posts/Example-SwapLogo')
app.post('/api/swapLogo', upload.array('imageUploads', 1), async (req, res) => {
	try {
		const senderName = req.body.fromName
		if (senderName == null) {
			res.status(500).json({ error: `No senderName sent.` })
			return
		}
		if (req.files == null) {
			res
				.status(500)
				.json({ error: `${senderName} - Image uploads not found.` })
		} else if (req.files.length === 0) {
			res.status(500).json({ error: `${senderName} - No images sent.` })
		} else {
			const swap = await swapLogo(req.body, token)
			res.send(swap)
		}
	} catch (e) {
		res.send(e)
	}
})

app.delete('/api/delete/:action/:parent_id/:resource_id?', async (req, res) => {
	try {
		const { parent_id } = req.params
		const { resource_id } = req.params
		const { action } = req.params
		await deletePhoto(token, resource_id, parent_id, action)
		res.send({
			response: true
		})
	} catch (e) {
		res.send(e)
	}
})

app.listen(port, async () => {
	console.log(`\nServer started ${port}...\nPID - ${pid}`)
})
