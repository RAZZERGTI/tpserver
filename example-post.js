const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const fileStream = fs.createReadStream('most.jpg')
const formData = new FormData()
formData.append('photo', fileStream)

axios
	.post('http://localhost:3001/photo?user=GTI&album=44TP', formData, {
		headers: formData.getHeaders()
	})
	.then(response => {
		console.log(response.data)
	})
	.catch(error => {
		console.error(error)
	})
