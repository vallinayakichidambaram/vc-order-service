import { ApolloServer
 } from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone"
import { typeDefs, resolvers } from "./schema/schema";
import { configDotenv } from "dotenv";

configDotenv();

const startServer = async () => {
    const server = new ApolloServer({typeDefs, resolvers});

    const {url } = await startStandaloneServer(server, {
        listen: {port: 3000}
    })

    console.log(`Magic happens at ${url}`)
}

startServer();

