const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

const formData = new FormData()
formData.append('fromName', 'AlbumImage')

// const files = ['./logo.jpg', './TaP.png']
const files = ['./phot.jpg']

files.forEach(filePath => {
	const file = fs.readFileSync(filePath)
	formData.append('imageUploads', file, {
		filename: filePath
	})
})

fetch('http://188.212.124.120:3001/createAlbum', {
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
