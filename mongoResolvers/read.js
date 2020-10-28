const { createClient, uri} = require('./mongoClientConfiguration')
const { ObjectID } = require('mongodb')

// Queries
const getById = async (id, collectionName) => {
    const client = createClient()
    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        //ObjectID(id) is a shortcut for {"_id" : ObjectId(id)}
        const document = await collection.findOne(ObjectID(id))
        console.log("getById -> document", document)
        return {
            document,
            err: false
        }
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
        return {
            err,
            document: false
        }
    } finally {
        await client.close();
    }
}

const find = async (query, collectionName) => {
    const client = createClient()
    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        const documentArray = await collection.find(query).toArray();
        return {
            documentArray,
            err: false
        }
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
        return {
            err,
            documentArray: false
        }
    } finally {
        await client.close();
    }
}

const getAll = async (collectionName) => {
    const client = createClient()
    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        const array = await collection.find().toArray();
        return array
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
    } finally {
        await client.close();
    }
}

module.exports = {
    getById,
    getAll,
    find
}