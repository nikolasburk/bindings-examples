const { addFragmentToInfo } = require('graphql-binding')
const { GraphQLServer } = require('graphql-yoga')
const Binding = require('./postBinding')

const postBinding = new Binding()

const typeDefs = `
type Query {
  posts(searchString: String): [Post!]!
}

type Mutation {
  createDraft(title: String!, content: String!): Post
  publish(id: ID!): Post
  deletePost(id: ID!): Post
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
}
`

const resolvers = {
  Query: {
    posts: async (parent, args, ctx, info) => {
      const searchString = args.searchString ? args.searchString : ''
      const ensureTitleAndContentFragment = `
        fragment EnsureTitleAndContentFragment on Post {
          title
          content
        }
      `
      const allPosts = await postBinding.query.posts({}, info)
      // .posts({}, addFragmentToInfo(info, ensureTitleAndContentFragment))

      return allPosts.filter(
        post =>
          post.title.includes(searchString) ||
          post.content.includes(searchString),
      )
    },
  },
  Mutation: {
    createDraft: (parent, args, ctx, info) => {
      return postBinding.mutation.createPost(
        {
          title: args.title,
          content: args.content,
          published: false,
        },
        info,
      )
    },
    publish: (parent, args, ctx, info) => {
      return postBinding.mutation.updatePost(
        {
          id: args.id,
          published: true,
        },
        info,
      )
    },
    deletePost: (parent, args, ctx, info) => {
      return postBinding.deletePost(
        {
          id: args.id,
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`),
)
