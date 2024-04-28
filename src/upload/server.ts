import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { typeDefs, resolvers } from './schema';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true, // For security
  });

  await server.start();

  const app = express();

  // Apply the graphql-upload middleware before Apollo Server
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

  server.applyMiddleware({ app });

  // Start the Express server on port 4000
  const PORT = 4000;
  await new Promise<void>((resolve) => app.listen({ port: PORT }, resolve));

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  );
};

startServer();
