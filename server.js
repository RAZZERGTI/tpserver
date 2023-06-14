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
	getFeedById,
	getAllFields,
	deleteRow,
	threeValuesLikes,
	valuesLikes,
	getFieldsByRow,
	getLastPhotoByIdUser
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
		console.log('Hello')
		const albumId = req.params.album_id
		console.log('Album id - ',albumId)
		const requestBody = req.body.body
		console.log('req  - ',req.body)
		console.log('requestBody - ',requestBody)
		const parsedBody = JSON.parse(requestBody)
		console.log(parsedBody)
		const newTitle = parsedBody.title
		console.log(newTitle)
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
const multer = require('multer')
// const storage = multer.memoryStorage()
// const upload = multer({ storage })
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
		if(getAll.length > 0){
			res.send(getAll)
		} else{
			res.send([])	
		}
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
app.get('/api/getFeed/:idUser', async function (req, res) {
	try {
		const { idUser } = req.params
		const getFeed = await getFeedById(idUser)
		res.send(getFeed)
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
app.get('/api/like/:idUser', async function (req, res) {
	try {
		const { idUser } = req.params
		const getFields = await getFieldsByRow('likes', 'idUser', idUser)
		console.log(getFields)
		if (getFields.length > 0) {
			const idPhotos = getFields.map(item => item.idPhoto)
			console.log(idPhotos)
			const getCaptionByIdPhotos = await getCaption(idPhotos)
			console.log(getCaptionByIdPhotos)
			const result = getFields.map(album => {
				const idPhoto = album.idPhoto
				const matchingCaption = getCaptionByIdPhotos.find(
					photo => photo.idPhoto === idPhoto
				)
				const caption =
					matchingCaption && matchingCaption.caption
						? matchingCaption.caption
						: undefined
				return { ...album, ...(caption && { caption }) }
			})
			res.send(result)
		} else {
			res.send([])
		}
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
app.delete('/api/like/:resource_id', async function (req, res) {
	try {
		const { resource_id } = req.params
		const deleteFields = await deleteRow('likes', 'idPhoto', resource_id)
		res.send({
			response: true
		})
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
app.get('/api/getAllReports', async function (req, res) {
	try {
		const report = await getAllFields('reports')
		res.send(report)
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

app.get('/api/getLastPhoto/:idUser', async function (req, res) {
	try {
		const { idUser } = req.params
		const lastPhoto = await getLastPhotoByIdUser('photos', 'idUser', idUser)
		const lastElement = lastPhoto.pop()
		res.send([lastElement])
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
		console.log(token)
		const downloadZip = await downloadZipAlbum(token, resource_id)
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=photo_${date}.${downloadZip.extension}`
		)
		res.setHeader('Content-Type', `image/${downloadZip.extension}`)
		res.send(downloadZip.data)
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

app.post('/api/like', async (req, res) => {
	try {
		const { idUser, idAlbum, idPhoto, caption } = req.body
		let date = new Date().toLocaleString('en-US', {
			hour12: false,
			timeZone: 'Europe/Minsk'
		})
		await valuesLikes('likes', [idPhoto, idAlbum, idUser, date])
		res.send({
			response: true
		})
	} catch (error) {
		// Обработка ошибок, если таковые возникли при выполнении операций
		console.error('Ошибка при обработке запроса:', error)
		res.status(500).json({ error: 'Внутренняя ошибка сервера.' })
	}
})

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
// app.post(
// 	'/api/uploadVideo',
// 	upload.array('imageUploads', 10),
// 	async (req, res) => {
// 		try {
// 			const senderName = req.body.fromName
// 			const fileNames = req.files.map(file => file.originalname)
// 			if (senderName == null) {
// 				res.status(500).json({ error: `No senderName sent.` })
// 				return
// 			}
// 			if (req.files == null) {
// 				res
// 					.status(500)
// 					.json({ error: `${senderName} - Image uploads not found.` })
// 			} else if (req.files.length === 0) {
// 				res.status(500).json({ error: `${senderName} - No images sent.` })
// 			} else {
// 				console.log(req.body)
// 				console.log(fileNames)
// 			}
// 		} catch (e) {
// 			res.send(e)
// 		}
// 	}
// )
// const example = require('./posts/Example-Upload')
const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont('path/popins.ttf', { family: 'Font Name' })
app.post('/upload', upload.single('photo'), async (req, res) => {
	try {
		const circles = JSON.parse(req.body.circles)
		const rectangles = JSON.parse(req.body.rectangles)
		const caption = req.body.waterMark
		const color = req.body.color
		const border = req.body.border

		const image = await loadImage(req.file.path)

		const canvas = createCanvas(image.width, image.height)

		const ctx = canvas.getContext('2d')

		const centerX = canvas.width / 2
		const centerY = canvas.height / 2

		ctx.drawImage(image, 0, 0)

		if (border) {
			const borderWidth = 5
			const borderColor = color ? color : 'red'

			ctx.lineWidth = borderWidth
			ctx.strokeStyle = borderColor
			ctx.strokeRect(0, 0, canvas.width, canvas.height)
		}
		if (circles) {
			circles.forEach(circle => {
				const { x, y } = circle
				const circleRadius = 40
				const circleX = centerX + x
				const circleY = centerY + y
				ctx.beginPath()
				ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI)
				ctx.fillStyle = color ? color : 'blue'
				ctx.fill()
			})
		}
		if (rectangles) {
			rectangles.forEach(rectangle => {
				const { x, y } = rectangle
				const rectWidth = 100
				const rectHeight = 50
				const rectX = centerX + x - rectWidth / 2
				const rectY = centerY + y - rectHeight / 2
				ctx.fillStyle = color ? color : 'red'
				ctx.fillRect(rectX, rectY, rectWidth, rectHeight)
			})
		}
		if (caption) {
			const fontSize = 50
			const textWidth = ctx.measureText(caption).width
			const textHeight = fontSize
			const textX = centerX - textWidth / 2
			const textY = centerY - textHeight / 2

			ctx.font = `${fontSize}px "Font Name"`
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillStyle = 'rgba(255, 255, 255, 0.25);'

			ctx.translate(textX, textY)
			ctx.rotate(Math.PI / 4)

			ctx.fillText(caption, 0, 0)

			ctx.rotate(-Math.PI / 4)
			ctx.translate(-textX, -textY)
		}
		const fileName = `modified-${Date.now()}.jpg`
		const modifiedPhotoPath = `images/${fileName}`
		const modifiedPhotoStream = canvas.createJPEGStream()
		const writeStream = fs.createWriteStream(modifiedPhotoPath)
		modifiedPhotoStream.pipe(writeStream)

		writeStream.on('finish', async () => {
			fs.unlink(req.file.path, () => console.log('File deleted'))
			const uploadPhoto = await uploadImages(req.body, token, fileName)
			res.send(uploadPhoto)
		})

		writeStream.on('error', error => {
			console.error('Ошибка при сохранении фотографии:', error)
			res.status(500).json({ error: 'Ошибка при сохранении фотографии' })
		})
	} catch (error) {
		console.error('Ошибка при обработке фотографии:', error)
		res.status(500).json({ error: 'Ошибка при обработке фотографии' })
	}
})

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

app.delete('/api/deleteReport/:resource_id', async (req, res) => {
	try {
		const { resource_id } = req.params
		await deleteRow('reports', 'idPhoto', resource_id)
		res.send({
			response: true
		})
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
