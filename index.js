//🔰
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')
const { loadSchemaSync } = require('@graphql-tools/load')
const { addResolversToSchema } = require ('@graphql-tools/schema')
const { join } = require("path");

const resolvers = require('./schema/resolvers')

const typeDefs = loadSchemaSync(join(__dirname, './schema/schema.graphql'), { loaders: [new GraphQLFileLoader()] });

const app = express()

const schema = addResolversToSchema({
    schema: typeDefs,
    resolvers
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development" ? true : false
}))

app.get('/', (req, res) => {
    res.send('AAA')
})

//Always add some emojis to make the code looks a bit fun and keep the existential dread away
app.listen(4000, () => console.log('📡 Listening; port: 4000'))