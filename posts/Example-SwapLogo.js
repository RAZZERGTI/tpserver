const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

const formData = new FormData()
formData.append('fromName', 'SwapLogo')
formData.append('idAlbum', '60rn6985598f829124aa49c86b2dd5d26ec14')

// const files = ['./logo.jpg', './TaP.png']
// const files = ['./Sigma.jpg']
const files = ['./kiz.jpg']

files.forEach(filePath => {
	const file = fs.readFileSync(filePath)
	formData.append('imageUploads', file, {
		filename: filePath
	})
})

fetch('http://localhost:3001/swapLogo', {
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
