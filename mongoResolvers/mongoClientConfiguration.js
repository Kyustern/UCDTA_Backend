const { MongoClient } = require("mongodb");
require('dotenv').config()
const {
    ATLAS_ADMIN_PASSWORD,
    ATLAS_ADMIN_USERNAME,
    ATLAS_DB_NAME
} = process.env

// const uri = `mongodb+srv://${ATLAS_READONLY_USERNAME}:${ATLAS_READONLY_PASSWORD}@iprefermysql.nzjl9.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`
const uri = `mongodb+srv://${ATLAS_ADMIN_USERNAME}:${ATLAS_ADMIN_PASSWORD}@iprefermysql.nzjl9.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`

const createClient = () => new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = {
    uri,
    createClient
}