const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { makeBindingClass } = require('graphql-binding')
const { HttpLink } = require('apollo-link-http')
const { makeRemoteExecutableSchema } = require('graphql-tools')

const link = new HttpLink({ uri: 'http://localhost:4001', fetch })
const typeDefs = fs.readFileSync(
  path.join(__dirname, '../schemas/post-service.graphql'),
  'utf-8',
)

const schema = makeRemoteExecutableSchema({ link, schema: typeDefs })

module.exports = makeBindingClass({ schema })
