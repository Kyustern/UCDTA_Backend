const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

const {
    getById, 
    getListById,
    insertDocument
} = require('./resolvers')
//
// Types
//
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {type: GraphQLString},
        nickName: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        created: {
            type: new GraphQLList(TodoType),
            resolve(parentValue, args) {
                return getListById(parentValue._id, 'todos').then(data => data)
            }
        }
    })
})

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: () => ({
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        done: { type: GraphQLBoolean },
        duration: { type: GraphQLInt },
        creationTimeStamp: { type: GraphQLInt },
        creatorId: { type: GraphQLString },
        creator: {
            type: UserType,
            resolve(parentValue, args) {
                return getById(parentValue.creatorId, 'users').then(user => user)
            }
        }
    })
})
//
// RootQuery 
//
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        todo: {
            type: TodoType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return getById(args.id, 'todos').then(data => data)
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return getById(args.id, 'users').then(data => data)
            }
        }
    }
})
//
// Mutations
//
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                done: { gtype: new GraphQLNonNull(GraphQLBoolean) },
                duration: { type: GraphQLInt },
                creationTimeStamp: { type: new GraphQLNonNull(GraphQLInt) },
                creatorId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                console.log("resolve -> args", args)
                return insertDocument().then(d => d)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    mutation,
    query: RootQuery
})