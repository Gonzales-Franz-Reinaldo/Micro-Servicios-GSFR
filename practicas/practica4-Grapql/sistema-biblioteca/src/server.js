import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { AppDataSource } from './config/dataSource.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
    try {
        // Initialize TypeORM
        await AppDataSource.initialize();
        console.log('✅ Database connected and synchronized');

        // Apollo Server setup
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        });

        await server.start();
        console.log('🚀 Apollo Server started');

        // Middleware for GraphQL
        app.use(
            '/graphql',
            express.json(),
            expressMiddleware(server)
        );

        app.listen(port, () => {
            console.log(`🌟 Server running at http://localhost:${port}/graphql`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
    }
}

startServer();