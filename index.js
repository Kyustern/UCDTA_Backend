//🔰
const express = require('express')
const session = require('express-session')
const { graphqlHTTP } = require('express-graphql');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')
const { loadSchemaSync } = require('@graphql-tools/load')
const { addResolversToSchema } = require ('@graphql-tools/schema')
const { join } = require("path");

const { SESSION_SECRET } = process.env

const resolvers = require('./schema/resolvers');
const { resolveTxt } = require('dns');

const typeDefs = loadSchemaSync(join(__dirname, './schema/schema.graphql'), { loaders: [new GraphQLFileLoader()] });

const app = express()

const schema = addResolversToSchema({
    schema: typeDefs,
    resolvers
})

app.use(
    session({
        // store: mongodbstore -> when omitted, uses a in-memory store. do not use it in prod (high vuln risks)
        name: "sess",
        // secret: SESSION_SECRET,
        secret: "SESSION_SECRET",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === 'production'
        }
    }),
    (req, res, next) => {
        console.log("########## LOGGING MIDDLEWARE ##########");
        console.log("req.session -> ", req.session)
        console.log("##########    LOGGING ENDED   ##########");
        
        next()
    }
)

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development" ? true : false
}))

app.get('/', (req, res) => {
    res.send('AAA')
})

//Always add some emojis to make the code looks a bit fun and keep the existential dread away
app.listen(4000, () => console.log('📡 Listening; port: 4000'))