const axios = require('axios')
const downloadPhoto = async (token, resource_id) => {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `https://workdrive.zoho.eu/api/v1/download/${resource_id}`,
		responseType: 'arraybuffer',
		headers: {
			Authorization: `Bearer ${token}`,
			Cookie:
				'31de8a02ba=35dc8855699b61146b3fa00c5d848fe0; JSESSIONID=92AC231DB453627FB48CC4EB03AE2EF7; _zcsr_tmp=de0c1693-1cab-4a65-bb38-3bd9960753e4; zpcc=de0c1693-1cab-4a65-bb38-3bd9960753e4'
		}
	}

	try {
		const response = await axios.request(config)
		const contentDisposition = response.headers['content-disposition']
		const matches = contentDisposition.match(
			/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
		)
		const filename = matches[1].replace(/['"]/g, '')
		const extension = filename.split('.').pop()
		return { data: response.data, extension }
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	downloadPhoto
}
