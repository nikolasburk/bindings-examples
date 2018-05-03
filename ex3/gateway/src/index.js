const { GraphQLServer } = require('graphql-yoga')
const { addFragmentToInfo } = require('graphql-binding')
const generateName = require('sillyname')

const RemoteBinding = require('./RemoteBinding')

const userServiceBinding = new RemoteBinding({
  typeDefs: '../schemas/user-service.graphql',
  endpoint: 'https://user-service-bjlatpkhoz.now.sh/',
})
const postServiceBinding = new RemoteBinding({
  typeDefs: '../schemas/post-service.graphql',
  endpoint: 'https://post-service-mktssxhxpu.now.sh',
})

const typeDefs = `
# import Post from '../schemas/post-service.graphql'
# import User from '../schemas/user-service.graphql'

type Query {
  posts(searchString: String): [Post!]!
  user(id: ID!): User
}

type Mutation {
  createDraft(title: String!, content: String!): Post
  publish(id: ID!): Post
  deletePost(id: ID!): Post
  login(): User!
  changeName(id: ID!, newName: String!): User
}
`

const resolvers = {
  Query: {
    posts: (_, args, context, info) => {
      const searchString = args.searchString ? args.searchString : ''
      const ensureTitleAndContentFragment = `
        fragment EnsureTitleAndContentFragment on Post {
          title
          content
        }
      `
      return context.postService.query
        .posts({}, addFragmentToInfo(info, ensureTitleAndContentFragment))
        .filter(
          post =>
            post.title.includes(searchString) ||
            post.content.includes(searchString),
        )
    },
    user: (_, args, context, info) => {
      return context.postService.mutation.user(
        {
          id: args.id,
        },
        info,
      )
    },
  },
  Mutation: {
    createDraft: (_, args, context, info) => {
      return context.postService.mutation.createPost(
        {
          title: args.title,
          content: args.content,
          published: false,
        },
        info,
      )
    },
    publish: (_, args, context, info) => {
      return context.postService.mutation.updatePost(
        {
          id: args.id,
          published: true,
        },
        info,
      )
    },
    deletePost: (_, args, context, info) => {
      return context.postService.deletePost(
        {
          id: args.id,
        },
        info,
      )
    },
    login: (_, args, context, info) => {
      const sillyName = generateName()
      return context.userService.createUser(
        {
          name: sillyname,
        },
        info,
      )
    },
    changeName: (_, args, context, info) => {
      return context.userServiceBinding.updateUser(
        {
          id: args.id,
          name: newName,
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    userService: userServiceBinding,
    postService: postServiceBinding,
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))