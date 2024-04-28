import { GraphQLUpload } from 'graphql-upload';
import { gql } from 'apollo-server-express';

// Define your GraphQL schema
export const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }

  type Query {
    _empty: String
  }
`;

// Define resolvers
export const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Create a readable stream for the file
      const stream = createReadStream();

      // Save the file to disk (example logic)
      const fs = require('fs');
      const path = require('path');
      const outPath = path.join(__dirname, 'uploads', filename);
      const outStream = fs.createWriteStream(outPath);

      stream.pipe(outStream);

      return { filename, mimetype, encoding };
    },
  },
};
