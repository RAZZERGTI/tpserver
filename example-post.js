const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const url = 'http://localhost:3001/upload?'

const formData = new FormData()
formData.append('photo', fs.createReadStream('mostyk.jpeg'))

axios
	.post(url, formData, {
		headers: {
			...formData.getHeaders()
		}
	})
	.then(response => {
		console.log(response.data)
	})
	.catch(error => {
		console.log(error)
	})
