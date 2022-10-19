const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Ob#102030",
    database : "tpmobile",
    port: 3306,
    // user : "root",
    // password : 'root',
})
async function checkDbUser(name){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM users WHERE name='${name}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function createDbCode(arrCode) {
    let res = await new Promise((res, rej) =>
        connection.query(`INSERT INTO session(id, name, mail, password, code) VALUES (?, ?, ?, ?, ?)`,arrCode,
            (err, results) => err ? rej(err) : res(results)))
}
async function checkDbCode(id){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM session WHERE id=${id}`,
            (err, results) => err ? rej(err) : res(results)))
    return res[0];
}

async function recordingUser(arr){
    const sql = `INSERT INTO users(id, name, mail, password) VALUES (?, ?, ?, ?)`;
    connection.query(sql, arr, function(err, results) {
        console.log('Добавил')
    });
}

async function deleteDbCode(arrCode){
    const sql = `DELETE FROM session WHERE id = ${arrCode[0]}`;
    connection.query(sql, function(err, results) {
        console.log('Удалил')
    });
}
module.exports = {
    checkDbUser,
    createDbCode,
    checkDbCode,
    deleteDbCode,
    recordingUser
}
