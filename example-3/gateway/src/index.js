const { GraphQLServer } = require('graphql-yoga')
const { addFragmentToInfo } = require('graphql-binding')
const generateName = require('sillyname')
const RemoteBinding = require('./RemoteBinding')

const resolvers = {
  Query: {
    posts: async (parent, args, context, info) => {
      const searchString = args.searchString ? args.searchString : ''
      const ensureTitleAndContentFragment = `
        fragment EnsureTitleAndContentFragment on Post {
          title
          content
        }
      `
      const allPosts = await context.postService.query.posts(
        {},
        addFragmentToInfo(info, ensureTitleAndContentFragment),
      )

      return allPosts.filter(
        post =>
          post.title.includes(searchString) ||
          post.content.includes(searchString),
      )
    },
    user: (parent, args, context, info) => {
      return context.postService.query.user(
        {
          id: args.id,
        },
        info,
      )
    },
  },
  Mutation: {
    createDraft: (parent, args, context, info) => {
      return context.postService.mutation.createPost(
        {
          title: args.title,
          content: args.content,
          published: false,
        },
        info,
      )
    },
    publish: (parent, args, context, info) => {
      return context.postService.mutation.updatePost(
        {
          id: args.id,
          published: true,
        },
        info,
      )
    },
    deletePost: (parent, args, context, info) => {
      return context.postService.mutation.deletePost(
        {
          id: args.id,
        },
        info,
      )
    },
    login: (parent, args, context, info) => {
      const sillyName = generateName()
      return context.userService.mutation.createUser(
        {
          name: sillyname,
        },
        info,
      )
    },
    changeName: (parent, args, context, info) => {
      return context.userService.mutation.updateUser(
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
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    userService: new RemoteBinding({
      typeDefsPath: '../schemas/user-service.graphql',
      endpoint: 'http://localhost:4002',
    }),
    postService: new RemoteBinding({
      typeDefsPath: '../schemas/post-service.graphql',
      endpoint: 'http://localhost:4001',
    }),
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))