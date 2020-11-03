const { ApolloServer, gql } = require("apollo-server-lambda")

const faunadb = require("faunadb")
const q = faunadb.query

require("dotenv").config()

const typeDefs = gql`
  type Query {
    getBookmark: [bookmark]
  }
  type bookmark {
    url: String!
    description: String!
  }
  type Mutation {
    createBookmark(url: String!, desc: String!): bookmark
  }
`

const resolvers = {
  Query: {
    getBookmark: async () => {
      const client = new faunadb.Client({
        secret: process.env.FAUNA_SECRET,
      })
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("bookmarks"))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map(item => {
          return {
            url: item.data.url,
            description: item.data.description,
          }
        })
      } catch (error) {
        return [{ description: error.message, url: error.message }]
      }
    },
  },
  Mutation: {
    createBookmark: async (_, args) => {
      const client = new faunadb.Client({
        secret: process.env.FAUNA_SECRET,
      })
      try {
        const result = await client.query(
          q.Create(q.Collection("bookmarks"), {
            data: {
              url: args.url,
              description: args.desc,
            },
          })
        )
        return {
          url: result.data.url,
          description: result.data.description,
        }
      } catch (error) {
        return {
          description: error.message,
          url: error.message,
        }
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
})

exports.handler = server.createHandler()
