const { MongoClient } = require('mongodb')

const mongo_uri = process.env.MONGO_URI;
const client = new MongoClient(mongo_uri);

exports.insertManyLogs = async (docs) => {
    try {
        await client.connect();
        const db = client.db("mariubialli");
        const collection = db.collection("whats_logs");
        const result = await collection.insertMany(docs, {})
        return result
    } catch (e) {
        console.error(e)

    } finally {
        await client.close();
    }
}


