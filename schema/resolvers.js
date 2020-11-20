const { find, getAll, getById } = require('../mongoResolvers/read')
const { deleteDocument, insertDocument, replaceDocument } = require('../mongoResolvers/write')
const { login, logout, register } = require('../auth')

const GraphQLLong = require('graphql-type-long');
const { ObjectID } = require('mongodb')

// single-line functions ( async (parentValue, args) => await stuff ) 
// could have been more convenient for some resolvers,
// but adding a console log for debugging was not possible, and reformatting them 
// everytime i want to do so was just awful

const root = {
    GraphQLLong,
    User: {
        created: async ({ _id }, args) => {
            return await find({creatorId: _id.toString()}, "todos")
        }
    },
    Query: {
        user: async (parentValue, args) => {
            const usr = await getById(args.id, "users")
            console.log("usr", usr)
            return usr.document
        },
        todo: async (parentValue, args) => {
            return await getById(args.id, "todos")
        },
        todos: async (parentValue, args) => {
            return await getAll("todos")
        },
        //Auth
        authTest: async (parentValue, args, req) => {

            if (req.session.userId) {
                console.log("req.session.userId", req.session.userId)
                return req.session.userId
            } else {
                return "no cookie"
            }
            // const salt = await genSalt()
            // const result = await hash('test', salt)
            // console.log("lel -> result", result)
            // return result
        }
    },
    Mutation: {
        // Auth
        register: async (parentValue, { user }, req) => {
            const registerResult = await register(user, req)
            return registerResult
        },
        login: async (parentValue, { user }, req) => {
            return await login(user, req)
        },
        logout: async (parentValue, args, req) => {
            return await logout()
        },
        // Todos
        createTodo: (parentValue, { todo }) => {
            console.log("creating todo");
            return insertDocument(todo, "todos").then(x => x)
        },
        deleteTodo: async (parentValue, { id }) => await deleteDocument({_id: ObjectID(id)}, "todos"),
        replaceTodo: (parentValue, { todo, id }) => {
            console.log("todo, id", todo, id)
            return replaceDocument(todo, id, "todos").then(x => x)
        }
    }
}

module.exports = root