const axios = require('axios')
const { downloadProgress } = require('./downloadProgress')
const downloadZipAlbum = async (token, resource_id) => {
	let data = `{\r\n   data: {\r\n      attributes: {\r\n         resource_id: "${resource_id}"\r\n      },\r\n      type: "files"\r\n   }\r\n}`

	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://workdrive.zoho.eu/api/v1/multizip',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'text/plain',
			Cookie:
				'31de8a02ba=155d76c9bee61a92b2defd3821f0aa0a; JSESSIONID=1EFC3DFBA2D8136C891268708599834F; _zcsr_tmp=df26a12e-3864-4e10-a910-6cdca48e33e8; zpcc=df26a12e-3864-4e10-a910-6cdca48e33e8'
		},
		data: data
	}
	try {
		const response = await axios.request(config)
		console.log(response)
		const downProgress = await downloadProgress(token, response.data.wmsKey)
		console.log(downProgress)
		// return { data: response.data, extension }
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	downloadZipAlbum
}
