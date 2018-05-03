const { GraphQLServer } = require('graphql-yoga')
const { makeExecutableSchema } = require('graphql-tools')

let idCount = 0
const posts = []

const resolvers = {
  Query: {
    posts: () => posts,
    post: (parent, args) => posts.find(post => post.id === args.id),
  },
  Mutation: {
    createDraft: (parent, args) => {
      const post = {
        id: `post_${idCount++}`,
        title: args.title,
        content: args.content,
        published: false,
      }
      posts.push(post)
      return post
    },
    deletePost: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      const deleted = posts.splice(postIndex, 1)
      return deleted[0]
    },
    publish: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      posts[postIndex].published = true
      return posts[postIndex]
    },
  },
}

export const schema = makeExecutableSchema({
  typeDefs: './src/schema.graphql',
  resolvers,
})

const server = new GraphQLServer({ schema })
server.start(() => console.log(`Server is running at http://localhost:4000`))
