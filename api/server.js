const express = require("express");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const typeDefs = require("../graphql/schemas");
const resolvers = require("../graphql/resolvers");
const context = require("../graphql/context");
const app = express();

app.use(cors());

//

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    debug: false,
    introspection: true,
    playground: {
      settings: {
        "schema.polling.enable": false,
      },
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/api" });
}
startServer();
const server = createServer(app);

module.exports = server;
