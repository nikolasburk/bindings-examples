import { Binding } from 'graphql-binding'
import { HTTPLink } from 'apollo-link-http'
import { importSchema } from 'graphql-import'
import { makeRemoteExecutableSchema } from 'graphql-tools'

class RemoteBinding extends Binding {
  constructor({ typeDefs, endpoint }) {
    if (typeDefs.endsWith('.graphql')) {
      typeDefs = importSchema(typeDefs)
    }

    const link = new HTTPLink({
      uri: endpoint,
    })
    const remoteSchema = makeRemoteExecutableSchema({
      link,
      schema: typeDefs,
    })

    super({
      schema: remoteSchema,
    })
  }
}

module.exports = RemoteBinding