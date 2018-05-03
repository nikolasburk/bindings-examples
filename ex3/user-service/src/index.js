const { GraphQLServer } = require('graphql-yoga')
const { makeExecutableSchema } = require('graphql-tools')
const fs = require('fs')

let idCount = 0
const users = []

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find(user => user.id === args.id),
  },
  Mutation: {
    createUser: (parent, args) => {
      const user = {
        id: `user_${idCount++}`,
        name: args.name,
      }
      users.push(user)
      return user
    },
    deleteUser: (parent, args) => {
      const userIndex = users.findIndex(user => user.id === args.id)
      const deleted = users.splice(userIndex, 1)
      return deleted[0]
    },
    updateUser: (parent, args) => {
      const userIndex = users.findIndex(user => user.id === args.id)
      users[userIndex].name = args.name
      return users[userIndex]
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(__dirname + '/schema.graphql', 'utf-8'),
  resolvers,
})

const server = new GraphQLServer({ schema })
server.start(() => console.log(`Server is running at http://localhost:4000`))

module.exports = schema