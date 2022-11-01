const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Ob#102030",
    database : "tpmobile",
    port: 3306,
    // host : "localhost",
    // user : "root",
    // password : "root",
    // database : "user1026_tp",
    // port: 3306,
})
async function usersCheckDbUser(name){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM users WHERE name='${name}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function usersCheckDbMail(mail){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM users WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function sessionCheckDbUser(name){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM registration WHERE name='${name}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function sessionCheckDbMail(mail){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM registration WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function createDbCode(arrCode) {
    let res = await new Promise((res, rej) =>
        connection.query(`INSERT INTO registration(id, name, mail, password, code) VALUES (?, ?, ?, ?, ?)`,arrCode,
            (err, results) => err ? rej(err) : res(results)))
}
async function checkDbCode(id){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM registration WHERE id=${id}`,
            (err, results) => err ? rej(err) : res(results)))
    return res[0];
}

async function recordingUser(arr){
    const sql = `INSERT INTO users(id, name, mail, password) VALUES (?, ?, ?, ?)`;
    connection.query(sql, arr, function(err, results) {

    });
}

async function deleteDbCode(table,row,value){
    const sql = `DELETE FROM ${table} WHERE ${row} = '${value}'`;
    connection.query(sql, function(err, results) {

    });
}
async function checkWithMail(mail){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM users WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function createSessionTable(table,[mail, code]){
    let res = await new Promise((res, rej) =>
        connection.query(`INSERT INTO ${table}(mail, code) VALUES (?, ?)`,[mail, code],
            (err, results) => err ? rej(err) : res(results)))
}
async function checkSessReductionCode(mail,code){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM reduction WHERE mail='${mail}' AND code=${code}`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function checkSessReductionMail(mail){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM reduction WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}
async function deleteSessReductionCode(mail){
    let res = await new Promise((res, rej) =>
        connection.query(`DELETE FROM reduction WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
}
async function updatePassword(mail,password){
    let res = await new Promise((res, rej) =>
        connection.query(`UPDATE users SET password ='${password}' WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
}
async function checkDbUserAuth(row, nameOrMail, password){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM users WHERE ${row}='${nameOrMail}' AND password='${password}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res[0];
}
async function returnCodeAuth(value){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM authorization WHERE mail='${value}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res[0];
}
module.exports = {
    returnCodeAuth,
    usersCheckDbUser,
    usersCheckDbMail,
    sessionCheckDbUser,
    sessionCheckDbMail,
    createDbCode,
    checkDbCode,
    deleteDbCode,
    recordingUser,
    checkWithMail,
    createSessionTable,
    checkSessReductionCode,
    checkSessReductionMail,
    deleteSessReductionCode,
    updatePassword,
    checkDbUserAuth
}
