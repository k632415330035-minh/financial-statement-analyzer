const connection = require("../config/dbMySQL");

const getAllResidentAccount = async () => {
    let queryStatement = `SELECT * FROM accounts`;
    try {
        const [results, fields] = await connection.query(queryStatement);
        return results;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAllResidentAccount
};