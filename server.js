const express = require('express')
const app = express()
const port = 3001
const pid = process.pid
// const multer = require('multer')
//
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'uploads/')
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
// 		cb(
// 			null,
// 			file.fieldname +
// 				'-' +
// 				uniqueSuffix +
// 				'.' +
// 				file.originalname.split('.').pop()
// 		)
// 	}
// })
//
// const upload = multer({
// 	storage: storage,
// 	fileFilter: function (req, file, cb) {
// 		const filetypes = /jpeg|jpg|png|gif/ // разрешенные расширения файлов
// 		const mimetype = filetypes.test(file.mimetype)
// 		const extname = filetypes.test(
// 			path.extname(file.originalname).toLowerCase()
// 		)
// 		if (mimetype && extname) {
// 			return cb(null, true)
// 		}
// 		cb('Ошибка: Разрешенные расширения файлов: ' + filetypes)
// 	}
// })

const createUser = require('./registration/createUser')
const authUser = require('./authorization/authUser')
const confirmCodeReg = require('./registration/confirmCodeReg')
const reduction = require('./reduction/reductionPassword')
const repeatCode = require('./repeat/repeatCode')
const albums = require('./albums/getAlbums')

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
app.get('/api/albums?', async function (req, res) {
	try {
		let url = `${req.originalUrl}`
		const getAlbums = albums.getAlbums(url)
		res.send(getAlbums)
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
const uploadPhoto = require('./mega/upload-photo')
// const example = require('./example-post')
// const example = require('./postec')
// const downloadPhoto = require('./mega/download-photo')
const upload = require('./helpers/multer_config').upload
app.post('/upload', upload.array('imageUploads', 10), (req, res) => {
	const senderName = req.body.fromName
	console.log('ReqBody - ', req.body)
	let url = `${req.originalUrl}`
	console.log('SenderName - ', senderName)
	if (senderName == null) {
		res.status(500).json({ error: `No senderName sent.` })
		return
	}

	if (req.files == null) {
		res.status(500).json({ error: `${senderName} - Image uploads not found.` })
	} else if (req.files.length === 0) {
		res.status(500).json({ error: `${senderName} - No images sent.` })
	} else {
		res.send({
			response: true
		})
	}
})

app.listen(port, () => {
	console.log(`\nServer started ${port}...\nPID - ${pid}`)
})
