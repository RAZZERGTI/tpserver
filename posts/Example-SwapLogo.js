const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

const formData = new FormData()
formData.append('fromName', 'SwapLogo')
formData.append('idAlbum', '6vv8s86249ebf8af54d52a7a4096184f68593')

// const files = ['./logo.jpg', './TaP.png']
// const files = ['./Sigma.jpg']
const files = ['./TaP.png']

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
