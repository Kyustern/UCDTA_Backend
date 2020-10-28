const { createClient, uri} = require('./mongoClientConfiguration')
    const { ATLAS_DB_NAME } = process.env
// Mutations
const insertDocument = async (document, collectionName) => {
    const client = createClient()
    try {
        await client.connect()
        const collection = client.db(ATLAS_DB_NAME).collection(collectionName)
        await collection.insertOne(document)
    } catch (error) {
        console.log(error);
        return false
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

module.exports = {
    insertDocument,
    deleteDocument,
    replaceDocument
}