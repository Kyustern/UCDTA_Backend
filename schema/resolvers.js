const { find, getAll, getById } = require('../mongoResolvers/read')
const { deleteDocument, insertDocument, replaceDocument } = require('../mongoResolvers/write')

const GraphQLLong = require('graphql-type-long');
const { ObjectID } = require('mongodb')
const { genSalt, hash } = require('bcryptjs')

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
        // Users
        createUser: async (parentValue, { user }) => {
            const salt = await genSalt()
            //if genSalt fails => return error 500 to client
            user.password = hash(user.password, salt)
            //insert document
            const result = await insertDocument(user, "users")
            //insertDocument returns false if operation failed, so:
            //if result === false => return error 500 to client
            //else:
            return result
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