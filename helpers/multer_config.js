const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './images/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname)
	}
})

const fileFilter = (req, file, cb) => {
	// reject a file
	console.log('File Original - ' + file.originalname)
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/heic' ||
		file.mimetype === 'image/webp' ||
		file.mimetype === 'application/pdf' ||
		file.mimetype === 'video/quicktime' ||
		file.mimetype === 'video/mp4' ||
		file.mimetype === 'video/h264' ||
		file.mimetype === 'video/mpeg'
	) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 2000 // 500MB -> 2GB
	},
	fileFilter: fileFilter
})

const fields = [
	{
		name: 'imageUploads',
		maxCount: 16
	},
	{
		name: 'videoUploads',
		maxCount: 16
	}
]

module.exports = {
	upload: upload,
	fields: fields
}
