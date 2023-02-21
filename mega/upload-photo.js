const mega = require('megajs')
const fs = require('fs')

const megaGmail = process.env.MEGA_GMAIL
const megaPass = process.env.MEGA_PASS

const storage = new mega.Storage(
	{ email: megaGmail, password: megaPass },
	() => {
		console.log('ready to work')
	}
)
let array = []
fs.readdir('images', (err, files) => {
	if (err) {
		console.log(err)
	} else {
		array.push(files)
		setTimeout(uploadFile, 7000, `images/${array[0]}`)
	}
})

const createFolder = nameFolder => {
	storage.mkdir(`${nameFolder}`).then(folder => console.log(folder))
	return true
}
const uploadFile = path => {
	const file = { name: `photo.jpg`, size: 100, path: path }
	const upload = storage.upload({ name: file.name, size: file.size })
	const readStream = fs.createReadStream(file.path)
	readStream.pipe(upload)
	array = []
}

module.exports = {
	createFolder
}
