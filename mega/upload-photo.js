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
			console.log(files[0])
			let path = `images/${files[0]}`
			console.log(path)
			let data = fs.readFileSync(path)
			console.log(data)
			uploadFile(files[0], path)
			setTimeout(deleteFile, 2000, path)
		}
	})
	const uploadFile = async (name, path) => {
		return new Promise((resolve, reject) => {
			const file = { name: name, size: 100, path: path }
			const upload = storage.upload({ name: file.name, size: file.size })
			const readStream = fs.createReadStream(file.path)
			readStream.pipe(upload)
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
