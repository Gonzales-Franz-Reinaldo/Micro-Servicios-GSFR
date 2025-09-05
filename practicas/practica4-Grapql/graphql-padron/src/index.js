require("reflect-metadata");

const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "gonzales",
    password: "gonzales123",
    database: "graphql_practica",
    synchronize: true,
    logging: false,
    entities: [Mesa, Padron]
});

// Exportar AppDataSource
module.exports = { AppDataSource };

async function startServer() {
    try {
        const app = express();
        
        // Importar resolvers después de exportar AppDataSource
        const resolvers = require("./schema/resolvers");
        
        const server = new ApolloServer({
            typeDefs,
            resolvers
        });
        
        await server.start();
        server.applyMiddleware({ app });
        
        await AppDataSource.initialize();
        console.log("✅ Conectado a la base de datos");
        
        app.listen(4000, () => {
            console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
    }
}

startServer();