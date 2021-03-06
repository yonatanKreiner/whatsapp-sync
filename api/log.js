const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://whatsappsync:012C6KdE4Gt7@ds042138.mlab.com:42138/whatsappsync';

const insert = async (collection, documents) => {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true });        
        await client.db('whatsappsync').collection(collection).insertOne(documents);
    } catch (err) {
        console.error(err.message);
    }
}

/* 1 - error
   2 - fatal
   3 - info */

const log = async (sevirity, message, err = undefined) => {
    const entry = {
        service: 'api',
        sevirity,
        message,
        timestamp: new Date()
    };

    if (err) {
        await insert('logs', Object.assign({}, entry, {error: util.inspect(err)}));
    } else {
        await insert('logs', entry);
    }
}

module.exports = log;