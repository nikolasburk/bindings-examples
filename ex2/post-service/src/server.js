const { GraphQLServer } = require('graphql-yoga')
const schema = require('./schema')

const server = new GraphQLServer({ schema })
server.start(() => console.log(`Server is running at http://localhost:4000`))
