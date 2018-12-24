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

const log = async (message, error = undefined) => {
    const entry = error ? Object.assign({}, {message}, {error}) : {message};
    await insert('logs', entry);    
}

module.exports = log;