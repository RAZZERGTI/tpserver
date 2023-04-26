const express = require('express')
const app = express()
const port = 3001
const pid = process.pid

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
const albums = require('./albums/getAlbums')
const { uploadImages } = require('./zoho/album/upload/upload')
const { downloadPhoto } = require('./zoho/album/download/download')

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

// app.get('/download/:resource_id', async function (req, res) {
// 	try {
// 		console.log(await getToken())
// 		const { resource_id } = req.params
// 		// console.log(resource_id)
// 		const download = downloadPhoto(await getToken(), resource_id)
// 		res.send(download)
// 	} catch (e) {
// 		return {
// 			error: {
// 				statusCode: 500,
// 				name: 'Internal Server Error',
// 				message: `${e}`
// 			}
// 		}
// 	}
// })
// const example = require('./posts/Example-CreateAlbum')
app.post('/createAlbum', upload.array('imageUploads', 10), async (req, res) => {
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
			const create = await createAlbum.createAlbum(req.body)
			res.send(create)
		}
	} catch (e) {
		res.send(e)
	}
})

// const example = require('./posts/Example-Upload')
app.post('/uploadPhoto', upload.array('imageUploads', 10), async (req, res) => {
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
			const uploadPhoto = await uploadImages(req.body)
			res.send(uploadPhoto)
		}
	} catch (e) {
		res.send(e)
	}
})

// const exampleLogo = require('./posts/Example-SwapLogo')
app.post('/swapLogo', upload.array('imageUploads', 1), async (req, res) => {
	const senderName = req.body.fromName
	if (senderName == null) {
		res.status(500).json({ error: `No senderName sent.` })
		return
	}
	if (req.files == null) {
		res.status(500).json({ error: `${senderName} - Image uploads not found.` })
	} else if (req.files.length === 0) {
		res.status(500).json({ error: `${senderName} - No images sent.` })
	} else {
		const swap = await swapLogo(req.body)
		res.send(swap)
	}
})

app.delete('/delete/:action/:parent_id/:resource_id', async (req, res) => {
	const { parent_id } = req.params
	const { resource_id } = req.params
	const { action } = req.params
	await deletePhoto(await getToken(), resource_id, parent_id, action)
	res.send({
		response: true
	})
})

app.listen(port, () => {
	console.log(`\nServer started ${port}...\nPID - ${pid}`)
})
