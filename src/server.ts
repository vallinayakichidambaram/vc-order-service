import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./schema/schema";
import { configDotenv } from "dotenv";

configDotenv();

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) =>  console.log(`🚀 Apollo Server ready at ${url}graphql`));