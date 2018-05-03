const { postBinding } = require('./post/postBinding')
const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
type Query {
  posts(searchString: String): [Post!]!
}

type Mutation {
  createDraft(title: String!, content: String!): Post
  publish(id: ID!): Post
  deletePost(id: ID!): Post
}
`

const resolvers = {
  Query: {
    posts: (_, args, _, info) => {
      const searchString = args.searchString ? args.searchString : ''
      return postBinding.query
        .posts({}, info)
        .filter(
          post =>
            post.title.includes(searchString) ||
            post.content.includes(searchString),
        )
    },
    Mutation: {
      createDraft: (_, args, _, info) => {
        return postBinding.mutation
          .createPost({
            title: args.title,
            content: args.content,
            published: false
          }, info)
      },
      publish: (_, args, _, info) => {
        return postBinding.mutation
          .updatePost({
            id: args.id,
            published: true
          }, info)
      },
      deletePost: (_, args, _, info) => {
        return postBinding.deletePost({
          id: args.id
        }, info)
      }
    }
  }

}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})
server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))