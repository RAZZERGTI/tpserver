const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const fileStream = fs.createReadStream('lexs.jpeg')
const formData = new FormData()
formData.append('photo', fileStream)

axios
	.post(
		'http://localhost:3001/photo?id_user=123213&id_album=123123',
		formData,
		{
			headers: formData.getHeaders()
		}
	)
	.then(response => {
		console.log(response.data)
	})
	.catch(error => {
		console.error(error)
	})
