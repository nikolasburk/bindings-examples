const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { Binding } = require('graphql-binding')
const { HttpLink } = require('apollo-link-http')
const { makeRemoteExecutableSchema } = require('graphql-tools')

class RemoteBinding extends Binding {
  constructor({ typeDefsPath, endpoint }) {
    const link = new HttpLink({ uri: endpoint, fetch })
    const typeDefs = fs.readFileSync(
      path.join(__dirname, typeDefsPath),
      'utf-8',
    )

    const schema = makeRemoteExecutableSchema({ link, schema: typeDefs })

    super({
      schema: schema,
    })
  }
}

module.exports = RemoteBinding
