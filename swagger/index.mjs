import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import swaggerAutogen from 'swagger-autogen'

const _dirname = dirname(fileURLToPath(import.meta.url))

const doc = {
	info: {
		title: 'TaP API',
		description: 'Официальное API приложения TaP'
	},
	definitions: {
		Registration: {
			id: '1',
			text: 'test',
			done: false
		},
		Authorization: {
			text: 'test'
		},
		Reduction: {
			text: 'test'
		},
		CreateAlbum: {
			text: 'test'
		},
		UploadPhoto: {
			text: 'test'
		},
		SwapLogo: {
			text: 'test'
		},
		DeletePhoto: {
			action: 'logo or photo',
			parent_id: 'id album',
			resource_id: 'id photo'
		},
	},
	host: 'localhost:3000',
	schemes: ['http']
}

// путь и название генерируемого файла
const outputFile = join(_dirname, 'output.json')
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../server.js')]

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(
	({ success }) => {
		console.log(`Generated: ${success}`)
	}
)
