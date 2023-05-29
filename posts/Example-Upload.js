const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config()
const parent_id = process.env.PARENT_ID_TAP

const formData = new FormData()
formData.append('fromName', 'uploadPhoto')
formData.append('idAlbum', 'bdalredd1675c134341b790dc3ec892d3070f')

// const files = ['./logo.jpg', './TaP.png']
// const files = ['./TaP.png']
// const files = ['./logo.jpg']
const files = ['./Sigma.jpg']

files.forEach(filePath => {
	const file = fs.readFileSync(filePath)
	formData.append('imageUploads', file, {
		filename: filePath
	})
})

// fetch('http://188.212.124.120:3001/api/uploadPhoto', {
fetch('http://localhost:3001/api/uploadPhoto', {
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
