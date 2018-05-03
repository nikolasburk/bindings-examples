const { makeExecutableSchema } = require('graphql-tools')

let idCount = 0
const posts = []

const typeDefs = `
type Query {
  posts: [Post!]!
  post(id: ID!): Post
  description: String!
}

type Mutation {
  createPost(title: String!, content: String!, published: Boolean): Post!
  updatePost(id: ID!, title: String, content: String, published: Boolean): Post
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
    posts: () => posts,
    post: (parent, args) => posts.find(post => post.id === args.id),
  },
  Mutation: {
    createPost: (parent, args) => {
      const post = {
        id: `post_${idCount++}`,
        title: args.title,
        content: args.content,
        published: Boolean(args.published),
      }
      posts.push(post)
      return post
    },
    updatePost: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      posts[postIndex].title = args.title ? args.title : posts[postIndex].title
      posts[postIndex].content = args.content
        ? args.content
        : posts[postIndex].content
      posts[postIndex].published = Boolean(args.published)
      return posts[postIndex]
    },
    deletePost: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      const deleted = posts.splice(postIndex, 1)
      return deleted[0]
    },
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = schema