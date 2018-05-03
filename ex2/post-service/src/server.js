const { GraphQLServer } = require('graphql-yoga')
const schema = require('./schema')

const server = new GraphQLServer({ schema })
server.start({ port: 4001 }, () =>
  console.log(`Server is running at http://localhost:4001`),
)
