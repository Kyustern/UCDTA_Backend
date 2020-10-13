const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { MongoClient } = require("mongodb");
require('dotenv').config()

const {
    ATLAS_ADMIN_PASSWORD,
    ATLAS_ADMIN_USERNAME,
    ATLAS_DB_NAME
} = process.env
const uri = `mongodb+srv://${ATLAS_ADMIN_USERNAME}:${ATLAS_ADMIN_PASSWORD}@iprefermysql.nzjl9.mongodb.net/${ATLAS_DB_NAME}?retryWrites=true&w=majority`

const schema = require('./schema')

const app = express()

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
    // graphiql: process.env.NODE_ENV === "development" ? true : false
}))

app.get('/', (req, res) => {
    res.send('AAA')
})

app.listen(4000, () => console.log('ass'))