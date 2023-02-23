const mega = require('megajs')
const fs = require('fs')

const megaGmail = process.env.MEGA_GMAIL
const megaPass = process.env.MEGA_PASS

async function connectToMega() {
	return new Promise((resolve, reject) => {
		const storage = new mega.Storage(
			{ email: megaGmail, password: megaPass },
			() => {
				console.log('Connected to Mega Cloud Storage')
				resolve(storage)
			}
		)
	})
}
async function uploadPhoto(storage) {
	fs.readdir('images', (err, files) => {
		if (err) {
			console.log(err)
		} else {
			let path = `images/${files[0]}`
			uploadFile(path)
			setTimeout(deleteFile, 3000, path)
		}
	})
	const uploadFile = async path => {
		return new Promise((resolve, reject) => {
			const file = { name: `photo.jpg`, size: 100, path: path }
			const upload = storage.upload({ name: file.name, size: file.size })
			const readStream = fs.createReadStream(file.path)
			readStream.pipe(upload)
			resolve(path)
		})
	}
	const deleteFile = path => {
		fs.unlink(path, err => {
			if (err) {
				console.log(err)
			} else {
				console.log('File deleted!')
			}
		})
	}
}

const createFolder = nameFolder => {
	storage.mkdir(`${nameFolder}`).then(folder => console.log(folder))
	return true
}

module.exports = {
	createFolder,
	uploadPhoto,
	connectToMega
}
