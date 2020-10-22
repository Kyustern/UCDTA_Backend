const { query } = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const GraphQLLong = require('graphql-type-long');

require('dotenv').config()
const {
    ATLAS_ADMIN_PASSWORD,
    ATLAS_ADMIN_USERNAME,
    ATLAS_DB_NAME
} = process.env

// const uri = `mongodb+srv://${ATLAS_READONLY_USERNAME}:${ATLAS_READONLY_PASSWORD}@iprefermysql.nzjl9.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`
const uri = `mongodb+srv://${ATLAS_ADMIN_USERNAME}:${ATLAS_ADMIN_PASSWORD}@iprefermysql.nzjl9.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`

const createClient = () => new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })


// Queries
const getById = async (id, collectionName) => {
    const client = createClient()
    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        //ObjectID(id) is a shortcut for {"_id" : ObjectId(id)}
        const document = await collection.findOne(ObjectID(id))
        return document
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
    } finally {
        await client.close();
    }
}

const find = async (query, collectionName) => {
    const client = createClient()
    try {
        await client.connect();
        const collection = client.db('uctda').collection(collectionName);
        const array = await collection.find(query).toArray();
        return array
    } catch (err) {
        console.log("Error getting data from mongoDB", err);
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


// Mutations
const insertDocument = async (document, collectionName) => {
    const client = createClient()
    try {
        await client.connect()
        const collection = client.db(ATLAS_DB_NAME).collection(collectionName)
        await collection.insertOne(document)
    } catch (error) {
        console.log(error);
    } finally {
        await client.close()
        return document
    }
}

const deleteDocument = async (query, collectionName) => {
    const client = createClient()
    try {
        await client.connect()
        const collection = client.db(ATLAS_DB_NAME).collection(collectionName)
        const result = await collection.deleteOne(query)
        // console.log("deleteDocument -> result", result)
        
        if (result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    } finally {
        await client.close()
    }
}

const replaceDocument = async (newDocument, oldDocumentId, collectionName) => {
    console.log("replaceDocument -> oldDocumentId", oldDocumentId)
    console.log("replaceDocument -> newDocument", newDocument)
    const client = createClient()
    try {
        await client.connect()
        const collection = client.db(ATLAS_DB_NAME).collection(collectionName)
        const result = await collection.replaceOne(
            { _id: ObjectID(oldDocumentId) },
            newDocument
        )
        console.log("replaceDocument -> result.modifiedCOunt", result.modifiedCount)
        if (result.modifiedCount === 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    } finally {

    }
}
    
const root = {
    GraphQLLong,
    User: {
        created: ({ _id }, args) => find({creatorId: _id.toString()}, "todos").then(x => x)
    },
    Query: {
        user: (parentValue, args) => {
            return getById(args.id, "users").then(x => x)
        },
        todo: (parentValue, args) => getById(args.id, "todos").then(x => x),
        todos: (parentValue, args) => getAll("todos")
    },
    Mutation: {
        createTodo: (parentValue, { todo }) => {
            console.log("creating todo");
            return insertDocument(todo, "todos").then(x => x)
        },
        deleteTodo: async (parentValue, { id }) => await deleteDocument({_id: ObjectID(id)}, "todos"),
        replaceTodo: (parentValue, { todo, id }) => {
            console.log("todo, id", todo, id)
            console.log('replaceTodo');
            return replaceDocument(todo, id, "todos").then(x => x)
        }
    }

}


module.exports = root