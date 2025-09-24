import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";

// Cargar el proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// Bases de datos en memoria
const estudiantes = new Map();  
const cursos = new Map();      
const estudianteToCursos = new Map(); 
const cursoToEstudiantes = new Map();  

// Implementación de los métodos
const serviceImpl = {
    AgregarEstudiante: (call, callback) => {
        const nuevo = call.request;
        if (estudiantes.has(nuevo.ci)) {
            return callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "Estudiante ya existe"
            });
        }
        estudiantes.set(nuevo.ci, nuevo);
        estudianteToCursos.set(nuevo.ci, new Set());
        callback(null, { estudiante: nuevo });
    },

    AgregarCurso: (call, callback) => {
        const nuevo = call.request;
        if (cursos.has(nuevo.codigo)) {
            return callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "Curso ya existe"
            });
        }
        cursos.set(nuevo.codigo, nuevo);
        cursoToEstudiantes.set(nuevo.codigo, new Set());
        callback(null, { curso: nuevo });
    },

    InscribirEstudiante: (call, callback) => {
        const { ci, codigo } = call.request;
        if (!estudiantes.has(ci)) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante no encontrado"
            });
        }
        if (!cursos.has(codigo)) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: "Curso no encontrado"
            });
        }
        const cursosDelEstudiante = estudianteToCursos.get(ci);
        if (cursosDelEstudiante.has(codigo)) {
            return callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "Estudiante ya inscrito en el curso"
            });
        }
        cursosDelEstudiante.add(codigo);
        cursoToEstudiantes.get(codigo).add(ci);
        callback(null, { mensaje: "Inscripción exitosa" });
    },

    ListarCursosDeEstudiante: (call, callback) => {
        const { ci } = call.request;
        if (!estudiantes.has(ci)) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante no encontrado"
            });
        }
        const codigos = estudianteToCursos.get(ci);
        const listaCursos = Array.from(codigos).map(codigo => cursos.get(codigo));
        callback(null, { cursos: listaCursos });
    },

    ListarEstudiantesDeCurso: (call, callback) => {
        const { codigo } = call.request;
        if (!cursos.has(codigo)) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: "Curso no encontrado"
            });
        }
        const cis = cursoToEstudiantes.get(codigo);
        const listaEstudiantes = Array.from(cis).map(ci => estudiantes.get(ci));
        callback(null, { estudiantes: listaEstudiantes });
    }
};

// Crear servidor
const server = new grpc.Server();
server.addService(proto.UniversidadService.service, serviceImpl);
const PORT = "50051";
server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Servidor gRPC escuchando en ${bindPort}`);
        server.start();
    }
);