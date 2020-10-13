const { MongoClient, ObjectID } = require("mongodb");
require('dotenv').config()
const {
    ATLAS_READONLY_USERNAME,
    ATLAS_READONLY_PASSWORD,
    ATLAS_DB_NAME
} = process.env

const uri = `mongodb+srv://${ATLAS_READONLY_USERNAME}:${ATLAS_READONLY_PASSWORD}@iprefermysql.nzjl9.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`

const createClient = () => new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true})


const getById = async (id, collectionName) => {
    const client = createClient()

    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        //ObjectID(id) is a shortcut for {"_id" : ObjectId(id)}
        const todo = await collection.findOne(ObjectID(id))
        return todo
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
    } finally {
        await client.close();
    }
}

const getListById = async (id, collectionName) => {
    const client = createClient()

    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        const query = {creatorId: id.toString()}
        const list = await collection.find(query).toArray();
        return list
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
    } finally {
        await client.close();
    }
}

const insertDocument = async (document, collectionName) => {
    const client = createClient()
    try {
        const collection = client.db(ATLAS_DB_NAME).collection(collectionName)
        await collection.insertOne(document)
        return true
    } catch (error) {
        console.log(error);
        return false
    } finally {
        await client.close()
    }
}


module.exports = {
    getById,
    getListById,
    insertDocument
}