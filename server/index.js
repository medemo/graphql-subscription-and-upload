const { ApolloServer, PubSub, gql } = require('apollo-server')
const fs = require('fs')

const pubsub = new PubSub()

setInterval(() => {
  pubsub.publish('RANDOM', { angka: Math.floor(Math.random() * 1000) })
}, 1000)

const typeDefs = gql`
  type Query {
    hello: String
  }

  type Subscription {
    angka: Int
  }

  type Mutation {
    upload (file: Upload!): String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world'
  },

  Subscription: {
    angka: {
      subscribe: () => pubsub.asyncIterator('RANDOM')
    }
  },

  Mutation: {
    upload: async (parent, args) => {
      const { createReadStream, filename } = await args.file
      const stream = createReadStream()
      const path = `./uploads/${Math.floor(Math.random() * 1000)}-${filename}`
      return new Promise((resolve, reject) => {
        stream
          .on('error', error => {
            if (stream.truncated)
              fs.unlinkSync(path)
            reject(error)
          })
          .pipe(fs.createWriteStream(path))
          .on('error', error => reject(error))
          .on('finish', () => resolve(path))
      })
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen()
  .then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  })
