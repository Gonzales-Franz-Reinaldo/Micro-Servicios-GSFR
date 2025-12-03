// server/server.js
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo proto
const PROTO_PATH = path.join(__dirname, '../proto/universidad.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const universidadProto = grpc.loadPackageDefinition(packageDefinition).universidad;

// Base de datos en memoria
const estudiantes = new Map(); // ci -> Estudiante
const cursos = new Map(); // codigo -> Curso
const inscripciones = new Map(); // ci -> Set(codigos_curso)

// Implementación de los servicios
const universidadService = {
    // Agregar un nuevo estudiante
    AgregarEstudiante: (call, callback) => {
        const estudiante = call.request;
        console.log(`📝 Intentando agregar estudiante: ${estudiante.nombres} ${estudiante.apellidos}`);

        if (estudiantes.has(estudiante.ci)) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                details: `El estudiante con CI ${estudiante.ci} ya existe`
            });
            return;
        }

        estudiantes.set(estudiante.ci, estudiante);
        inscripciones.set(estudiante.ci, new Set()); // Inicializar conjunto vacío de cursos

        callback(null, {
            ci: estudiante.ci,
            mensaje: `Estudiante ${estudiante.nombres} ${estudiante.apellidos} agregado exitosamente`,
            exito: true
        });
    },

    // Agregar un nuevo curso
    AgregarCurso: (call, callback) => {
        const curso = call.request;
        console.log(`📚 Intentando agregar curso: ${curso.nombre} (${curso.codigo})`);

        if (cursos.has(curso.codigo)) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                details: `El curso con código ${curso.codigo} ya existe`
            });
            return;
        }

        cursos.set(curso.codigo, curso);

        callback(null, {
            codigo: curso.codigo,
            mensaje: `Curso ${curso.nombre} agregado exitosamente`,
            exito: true
        });
    },

    // Inscribir estudiante en un curso
    InscribirEstudiante: (call, callback) => {
        const { ci_estudiante, codigo_curso } = call.request;
        console.log(`🎓 Intentando inscribir estudiante ${ci_estudiante} en curso ${codigo_curso}`);

        // Verificar si el estudiante existe
        if (!estudiantes.has(ci_estudiante)) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: `El estudiante con CI ${ci_estudiante} no existe`
            });
            return;
        }

        // Verificar si el curso existe
        if (!cursos.has(codigo_curso)) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: `El curso con código ${codigo_curso} no existe`
            });
            return;
        }

        // Verificar si ya está inscrito
        const cursosDelEstudiante = inscripciones.get(ci_estudiante);
        if (cursosDelEstudiante.has(codigo_curso)) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                details: `El estudiante ya está inscrito en este curso`
            });
            return;
        }

        // Realizar la inscripción
        cursosDelEstudiante.add(codigo_curso);

        callback(null, {
            mensaje: `Estudiante inscrito exitosamente en el curso ${codigo_curso}`,
            exito: true
        });
    },

    // Listar cursos de un estudiante
    ListarCursosDeEstudiante: (call, callback) => {
        const { ci } = call.request;
        console.log(`📋 Listando cursos del estudiante: ${ci}`);

        if (!estudiantes.has(ci)) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: `El estudiante con CI ${ci} no existe`
            });
            return;
        }

        const cursosDelEstudiante = inscripciones.get(ci);
        const cursosList = Array.from(cursosDelEstudiante)
            .map(codigo => cursos.get(codigo))
            .filter(curso => curso !== undefined);

        callback(null, {
            cursos: cursosList,
            mensaje: `Cursos del estudiante ${ci}: ${cursosList.length} cursos encontrados`
        });
    },

    // Listar estudiantes de un curso
    ListarEstudiantesDeCurso: (call, callback) => {
        const { codigo } = call.request;
        console.log(`👥 Listando estudiantes del curso: ${codigo}`);

        if (!cursos.has(codigo)) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: `El curso con código ${codigo} no existe`
            });
            return;
        }

        const estudiantesDelCurso = [];
        for (const [ci, cursosSet] of inscripciones.entries()) {
            if (cursosSet.has(codigo)) {
                const estudiante = estudiantes.get(ci);
                if (estudiante) {
                    estudiantesDelCurso.push(estudiante);
                }
            }
        }

        callback(null, {
            estudiantes: estudiantesDelCurso,
            mensaje: `Estudiantes del curso ${codigo}: ${estudiantesDelCurso.length} estudiantes encontrados`
        });
    }
};

// Crear y levantar el servidor
const server = new grpc.Server();
server.addService(universidadProto.UniversidadService.service, universidadService);

server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error('❌ Error al iniciar servidor:', error);
            return;
        }
        console.log(`🚀 Servidor gRPC de Universidad escuchando en puerto ${port}`);
        console.log('📡 Endpoint: 0.0.0.0:50051');
        console.log('⏰ Servidor listo para recibir peticiones...');
    }
);