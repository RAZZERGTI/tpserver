const mysql = require('mysql2')
require('dotenv').config()
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
const connection = mysql.createConnection({
	host: dbHost,
	user: dbUser,
	password: dbPassword,
	database: 'tpmobile',
	port: 3306
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root',
// 	database: 'user1026_tp',
// 	port: 3307
})
async function infoCheckDb(table, nameField, value) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`SELECT * FROM ${table} WHERE ${nameField}='${value}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res.length > 0
}
async function checkField(table, nameField, nameFieldCondition, value) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`SELECT ${nameField} FROM ${table} WHERE ${nameFieldCondition}='${value}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res[0]
}

async function returnCode(table, mailOrId, value) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`SELECT * FROM ${table} WHERE ${mailOrId}='${value}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res[0]
}

async function getTitle(arr, idUser) {
	let inClause = arr.map(id => `'${id}'`).join(',')
	let res = await new Promise((res, rej) =>
		connection.query(
			// `select title, idLogo from albums where idAlbum in (${inClause});`,
			`SELECT title, idLogo  FROM albums  WHERE idAlbum IN (${inClause}) AND (idCreator = '${idUser}' OR idUsers = '${idUser}');`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res.map((item, index) => ({
		id: arr[index],
		title: item.title,
		idLogo: item.idLogo
	}))
}

async function getPhotosByAlbumId(idAlbum) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`SELECT idImages  FROM albums WHERE idAlbum='${idAlbum}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res[0]
}
// async function getIdLogo(arr) {
// 	let inClause = arr.map(id => `'${id}'`).join(',')
// 	let res = await new Promise((res, rej) =>
// 		connection.query(
// 			`select title from albums where idLogo in (${inClause});`,
// 			(err, results) => (err ? rej(err) : res(results))
// 		)
// 	)
// 	return res.map(item => item.idLogo)
// }
///////////////////////////////////////////////////////////
async function checkSessReductionCode(mail, code) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`SELECT * FROM reduction WHERE mail='${mail}' AND code=${code}`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res.length > 0
}

//INSERTS
async function threeValues(table, [value1, value2, value3]) {
	await new Promise((res, rej) =>
		connection.query(
			`INSERT INTO ${table}(idAlbum, idLogo, idImages) VALUES (?, ?, ?)`,
			[value1, value2, value3],
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
async function sixValues(
	table,
	[value1, value2, value3, value4, value5, value6]
) {
	await new Promise((res, rej) =>
		connection.query(
			`INSERT INTO ${table}(idAlbum, idCreator, title, idLogo, idImages, idUsers) VALUES (?, ?, ?, ?, ?, ?)`,
			[value1, value2, value3, value4, value5, value6],
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
async function createSessionTable(table, [mail, code]) {
	await new Promise((res, rej) =>
		connection.query(
			`INSERT INTO ${table}(mail, code) VALUES (?, ?)`,
			[mail, code],
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
async function recordingUser(arr) {
	const sql = `INSERT INTO users(id, name, mail, password) VALUES (?, ?, ?, ?)`
	connection.query(sql, arr, function (err, results) {})
}
async function createDbCode(arrCode) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`INSERT INTO registration(id, name, mail, password, code) VALUES (?, ?, ?, ?, ?)`,
			arrCode,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
///////////////

///DELETES
async function deleteDbCode(table, row, value) {
	const sql = `DELETE FROM ${table} WHERE ${row} = '${value}'`
	connection.query(sql, function (err, results) {})
}
///////////////////

//////UPDATES
async function updateField(table, codeOrPassword, value, mail) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`UPDATE ${table} SET ${codeOrPassword} ='${value}' WHERE mail='${mail}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
async function updateLogo(table, value, idAlbum) {
	await new Promise((res, rej) =>
		connection.query(
			`UPDATE ${table} SET idLogo ='${value}' WHERE idAlbum='${idAlbum}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
async function updateIdImages(table, idPhoto, idAlbum) {
	await new Promise((res, rej) =>
		connection.query(
			`UPDATE ${table} SET idImages = CONCAT(idImages, ' ${idPhoto}') WHERE idAlbum = '${idAlbum}';`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
async function updateDelete(table, idPhoto, field, idAlbum) {
	await new Promise((res, rej) =>
		connection.query(
			`UPDATE ${table} SET ${field} = REPLACE(${field}, '${idPhoto}', '') WHERE idAlbum = '${idAlbum}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
}
/////////////////

async function checkDbUserAuth(row, nameOrMail, password) {
	let res = await new Promise((res, rej) =>
		connection.query(
			`SELECT * FROM users WHERE ${row}='${nameOrMail}' AND password='${password}'`,
			(err, results) => (err ? rej(err) : res(results))
		)
	)
	return res[0]
}
module.exports = {
	infoCheckDb,
	returnCode,
	createDbCode,
	deleteDbCode,
	recordingUser,
	createSessionTable,
	checkSessReductionCode,
	updateField,
	checkDbUserAuth,
	updateLogo,
	checkField,
	updateIdImages,
	updateDelete,
	sixValues,
	getTitle,
	getPhotosByAlbumId
	// getIdLogo
}
