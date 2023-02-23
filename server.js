const express = require('express')
const app = express()
const port = 3001
const pid = process.pid
const multer = require('multer')
const upload = multer({ dest: 'images/' })

const createUser = require('./registration/createUser')
const authUser = require('./authorization/authUser')
const confirmCodeReg = require('./registration/confirmCodeReg')
const reduction = require('./reduction/reductionPassword')
const repeatCode = require('./repeat/repeatCode')
const albums = require('./albums/getAlbums')
// const uploadPhoto = require('./mega/upload-photo')
const example = require('./example-post')

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
app.post('/photo?', upload.single('photo'), function (req, res) {
	try {
		let url = `${req.originalUrl}`
		console.log(url)
		res.send({ response: true })
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

app.listen(port, () => {
	console.log(`\nServer started ${port}...\nPID - ${pid}`)
})
