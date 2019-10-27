const fs = require('fs')
const http = require('http')
const express = require('express')
const { ApolloServer, PubSub, gql } = require('apollo-server-express')

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
      resolve: (parent, args, context) => {
        return parent.angka
      },
      subscribe: () => pubsub.asyncIterator('RANDOM')
    }
  },

  Mutation: {
    upload: async (parent, args, context) => {
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
  resolvers,
  subscriptions: {
    path: '/',
    onConnect: async (connectionParams, webSocket, connectionContext) => {
      return { user: 'Armedi' }
    }
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      return { user: 'Armedi' }
    }
  }
})

const app = express()
server.applyMiddleware({ app, path: '/' })

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(4000, () => {
  console.log(`🚀 Subscriptions ready at http://localhost:4000${server.subscriptionsPath}`);
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
})
