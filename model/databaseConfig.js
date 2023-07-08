//M.Rajkaran
//2109039
//DIT/FT/1B/02
const { MongoClient } = require('mongodb');


var dbconnect = {
    getConnection: async function () {
        const uri = 'mongodb+srv://userReadOnly:7ZT817O8ejDfhnBM@minichallenge.q4nve1r.mongodb.net/';
        const client = new MongoClient(uri);

        try {
            await client.connect();
            const database = client.db('minichallenge');
            return database;
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }
};
module.exports = dbconnect
