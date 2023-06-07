const axios = require('axios')
const downloadProgress = async (token, wms) => {
	let configProgress = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `https://www.zohoapis.eu/workdrive/downloadprogress?progressid=20091746419_${wms}`,
		headers: {
			Authorization: `Bearer ${token}`,
			Cookie:
				'97e1e525f7=e1cd0e8ff2cf39f34873d2fa9c8d5846; JSESSIONID=BE21079058159CD6080062DFD3C71234; _zcsr_tmp=d3ee8247-1e45-4698-ba22-2767147cc86d; zpcc=d3ee8247-1e45-4698-ba22-2767147cc86d'
		}
	}
	try {
		const downloadPro = await axios.request(configProgress)
		console.log(downloadPro)
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	downloadProgress
}
