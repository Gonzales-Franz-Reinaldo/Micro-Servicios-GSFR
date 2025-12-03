// server/server.js
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo proto
const PROTO_PATH = path.join(__dirname, '../proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Base de datos simulada
const users = [
    { user_id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 30, status: 'active' },
    { user_id: 2, name: 'María García', email: 'maria@email.com', age: 25, status: 'active' }
];

// Implementación de los servicios
const userService = {
    GetUser: (call, callback) => {
        console.log('🔍 Buscando usuario ID:', call.request.user_id);
        
        const user = users.find(u => u.user_id === call.request.user_id);
        
        if (user) {
            callback(null, user);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: 'Usuario no encontrado'
            });
        }
    },

    CreateUser: (call, callback) => {
        console.log('➕ Creando usuario:', call.request);
        
        const newUser = {
            user_id: users.length + 1,
            name: call.request.name,
            email: call.request.email,
            age: call.request.age,
            status: 'active'
        };
        
        users.push(newUser);
        callback(null, newUser);
    },

    ListUsers: (call) => {
        console.log('📋 Listando usuarios...');
        
        const limit = call.request.limit || users.length;
        
        users.slice(0, limit).forEach(user => {
            call.write(user);
        });
        
        call.end();
    }
};

// Crear y levantar el servidor
const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);

server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error('❌ Error al iniciar servidor:', error);
            return;
        }
        console.log(`🚀 Servidor gRPC escuchando en puerto ${port}`);
        console.log('📡 Endpoint: 0.0.0.0:50051');
    }
);