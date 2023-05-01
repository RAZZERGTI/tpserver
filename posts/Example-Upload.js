const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

const formData = new FormData()
formData.append('fromName', 'uploadPhoto')
formData.append('idAlbum', '9j3gid71d23b357b7465a8afadc2cc7313b20')

// const files = ['./logo.jpg', './TaP.png']
// const files = ['./TaP.png']
// const files = ['./logo.jpg']
const files = ['./siz.jpg']

files.forEach(filePath => {
	const file = fs.readFileSync(filePath)
	formData.append('imageUploads', file, {
		filename: filePath
	})
})

fetch('http://188.212.124.120:3001/uploadPhoto', {
	method: 'POST',
	body: formData,
	headers: {
		...formData.getHeaders()
	}
})
	.then(res => {
		if (!res.ok) {
			throw new Error('Error during request')
		}
		return res.json()
	})
	.then(data => {
		console.log(data)
	})
	.catch(err => {
		console.error(err)
	})
