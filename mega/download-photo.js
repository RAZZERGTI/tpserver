const fs = require('fs')
const fileId = '1677422620584-anime.jpg'
async function download(storage) {
	storage.files.get(fileId, (err, file) => {
		if (err) throw err
		// Скачайте файл.
		file.download((err, data) => {
			if (err) throw err

			// Сохраните данные в файл.
			fs.writeFile('downloaded_file.jpg', data, err => {
				if (err) throw err
				console.log('Файл загружен успешно!')
			})
		})
	})
}

module.exports = {
	download
}
