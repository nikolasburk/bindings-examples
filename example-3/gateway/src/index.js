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
    posts: async (parent, args, ctx, info) => {
      const searchString = args.searchString ? args.searchString : ''
      const ensureTitleAndContentFragment = `
        fragment EnsureTitleAndContentFragment on Post {
          title
          content
        }
      `
      const allPosts = await ctx.postService.query.posts(
        {},
        addFragmentToInfo(info, ensureTitleAndContentFragment),
      )

      return allPosts.filter(
        post =>
          post.title.includes(searchString) ||
          post.content.includes(searchString),
      )
    },
    user: (parent, args, ctx, info) => {
      return ctx.postService.mutation.user(
        {
          id: args.id,
        },
        info,
      )
    },
  },
  Mutation: {
    createDraft: (parent, args, ctx, info) => {
      return ctx.postService.mutation.createPost(
        {
          title: args.title,
          content: args.content,
          published: false,
        },
        info,
      )
    },
    publish: (parent, args, ctx, info) => {
      return ctx.postService.mutation.updatePost(
        {
          id: args.id,
          published: true,
        },
        info,
      )
    },
    deletePost: (parent, args, ctx, info) => {
      return ctx.postService.deletePost(
        {
          id: args.id,
        },
        info,
      )
    },
    login: (parent, args, ctx, info) => {
      const sillyName = generateName()
      return ctx.userService.createUser(
        {
          name: sillyname,
        },
        info,
      )
    },
    changeName: (parent, args, ctx, info) => {
      return ctx.userServiceBinding.updateUser(
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
  ctx: req => ({
    userService: userServiceBinding,
    postService: postServiceBinding,
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
