// client/client.js
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

// Crear cliente
const client = new userProto.UserService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

// Función para probar GetUser
function getUser(userId) {
    return new Promise((resolve, reject) => {
        client.GetUser({ user_id: userId }, (error, response) => {
            if (error) {
                console.error(`❌ Error al obtener usuario ${userId}:`, error.details);
                reject(error);
            } else {
                console.log(`✅ Usuario ${userId}:`, response);
                resolve(response);
            }
        });
    });
}

// Función para probar CreateUser
function createUser(userData) {
    return new Promise((resolve, reject) => {
        client.CreateUser(userData, (error, response) => {
            if (error) {
                console.error('❌ Error al crear usuario:', error.details);
                reject(error);
            } else {
                console.log('✅ Usuario creado:', response);
                resolve(response);
            }
        });
    });
}

// Función para probar ListUsers (streaming)
function listUsers(limit = 10) {
    return new Promise((resolve, reject) => {
        const call = client.ListUsers({ limit });
        const users = [];

        call.on('data', (user) => {
            console.log('📨 Usuario recibido:', user);
            users.push(user);
        });

        call.on('end', () => {
            console.log(`📊 Total de usuarios recibidos: ${users.length}`);
            resolve(users);
        });

        call.on('error', (error) => {
            console.error('❌ Error en stream:', error);
            reject(error);
        });
    });
}

// Ejecutar pruebas
async function runTests() {
    console.log('🧪 Iniciando pruebas gRPC...\n');

    try {
        // 1. Obtener usuario existente
        console.log('1. 🔍 Obteniendo usuario existente...');
        await getUser(1);

        // 2. Obtener usuario no existente
        console.log('\n2. 🔍 Obteniendo usuario no existente...');
        await getUser(999);

        // 3. Crear nuevo usuario
        console.log('\n3. ➕ Creando nuevo usuario...');
        await createUser({
            name: 'Carlos López',
            email: 'carlos@email.com',
            age: 28
        });

        // 4. Listar usuarios (streaming)
        console.log('\n4. 📋 Listando usuarios (streaming)...');
        await listUsers(3);

    } catch (error) {
        console.log('Algunas pruebas fallaron, pero es esperado para demostración');
    }

    console.log('\n✅ Pruebas completadas!');
}

// Ejecutar las pruebas
runTests();