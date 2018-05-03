const { makeExecutableSchema } = require('graphql-tools')

let idCount = 0
const posts = []

const typeDefs = `
type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(name: String!): User!
  updateUser(id: ID!, name: String!): User
  deleteUser(id: ID!): User
}

type User {
  id: ID!
  name: String!
}
`

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

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = schema
