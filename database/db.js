const mysql = require('mysql2');
const connection = mysql.createConnection({
    // host : "localhost",
    // user : "root",
    // password : "Ob#102030",
    // database : "tpmobile",
    // port: 3306,
    host : "localhost",
    user : "root",
    password : "root",
    database : "user1026_tp",
    port: 3306,
})
async function infoCheckDb(table,nameOrMail, value){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM ${table} WHERE ${nameOrMail}='${value}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}

async function returnCode(table,mailOrId,value){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM ${table} WHERE ${mailOrId}='${value}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res[0];
}
///////////////////////////////////////////////////////////
async function checkSessReductionCode(mail,code){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM reduction WHERE mail='${mail}' AND code=${code}`,
            (err, results) => err ? rej(err) : res(results)))
    return res.length > 0;
}

// async function checkReduction(nameOrMail,value){
//     let res = await new Promise((res, rej) =>
//         connection.query(`SELECT * FROM reduction WHERE ${nameOrMail}='${value}'`,
//             (err, results) => err ? rej(err) : res(results)))
//     return res.length > 0;
/// }
/////////////////////////////////////////////////////////////////////////////////



//INSERTS
async function createSessionTable(table,[mail, code]){
    let res = await new Promise((res, rej) =>
        connection.query(`INSERT INTO ${table}(mail, code) VALUES (?, ?)`,[mail, code],
            (err, results) => err ? rej(err) : res(results)))
}
async function recordingUser(arr){
    const sql = `INSERT INTO users(id, name, mail, password) VALUES (?, ?, ?, ?)`;
    connection.query(sql, arr, function(err, results) {

    });
}
async function createDbCode(arrCode) {
    let res = await new Promise((res, rej) =>
        connection.query(`INSERT INTO registration(id, name, mail, password, code) VALUES (?, ?, ?, ?, ?)`,arrCode,
            (err, results) => err ? rej(err) : res(results)))
}
///////////////

///DELETES
async function deleteDbCode(table,row,value){
    const sql = `DELETE FROM ${table} WHERE ${row} = '${value}'`;
    connection.query(sql, function(err, results) {

    });
}
///////////////////

//////UPDATES
async function updateField(table,codeOrPassword,value,mail){
    let res = await new Promise((res, rej) =>
        connection.query(`UPDATE ${table} SET ${codeOrPassword} ='${value}' WHERE mail='${mail}'`,
            (err, results) => err ? rej(err) : res(results)))
}
/////////////////

async function checkDbUserAuth(row, nameOrMail, password){
    let res = await new Promise((res, rej) =>
        connection.query(`SELECT * FROM users WHERE ${row}='${nameOrMail}' AND password='${password}'`,
            (err, results) => err ? rej(err) : res(results)))
    return res[0];
}
module.exports = {
    infoCheckDb,
    returnCode,
    // checkReduction,
    createDbCode,
    deleteDbCode,
    recordingUser,
    createSessionTable,
    checkSessReductionCode,
    updateField,
    checkDbUserAuth
}
