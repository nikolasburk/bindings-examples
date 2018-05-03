const { GraphQLServer } = require('graphql-yoga')
const { addFragmentToInfo } = require('graphql-binding')
const generateName = require('sillyname')
const RemoteBinding = require('./RemoteBinding')

const postServiceBinding = new RemoteBinding({
  typeDefsPath: '../schemas/post-service.graphql',
  endpoint: 'http://localhost:4001',
})
const userServiceBinding = new RemoteBinding({
  typeDefsPath: '../schemas/user-service.graphql',
  endpoint: 'http://localhost:4002',
})
// const postServiceBinding = new RemoteBinding({
//   typeDefs: '../schemas/post-service.graphql',
//   endpoint: 'https://post-service-mktssxhxpu.now.sh',
// })
// const userServiceBinding = new RemoteBinding({
//   typeDefs: '../schemas/user-service.graphql',
//   endpoint: 'https://user-service-bjlatpkhoz.now.sh/',
// })

const resolvers = {
  Query: {
    posts: async (_, args, context, info) => {
      const searchString = args.searchString ? args.searchString : ''
      const ensureTitleAndContentFragment = `
        fragment EnsureTitleAndContentFragment on Post {
          title
          content
        }
      `
      const allPosts = await context.postService.query.posts({}, info)
      // .posts({}, addFragmentToInfo(info, ensureTitleAndContentFragment))

      return allPosts.filter(
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
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    userService: userServiceBinding,
    postService: postServiceBinding,
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))