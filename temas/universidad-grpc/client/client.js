// client/client.js
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

// Crear cliente
const client = new universidadProto.UniversidadService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

// Funciones auxiliares para llamadas gRPC
function llamadaGrpc(method, request) {
    return new Promise((resolve, reject) => {
        client[method](request, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

// Funciones específicas del cliente
async function agregarEstudiante(estudiante) {
    try {
        const response = await llamadaGrpc('AgregarEstudiante', estudiante);
        console.log(`✅ ${response.mensaje}`);
        return response;
    } catch (error) {
        console.error(`❌ Error al agregar estudiante: ${error.details}`);
        throw error;
    }
}

async function agregarCurso(curso) {
    try {
        const response = await llamadaGrpc('AgregarCurso', curso);
        console.log(`✅ ${response.mensaje}`);
        return response;
    } catch (error) {
        console.error(`❌ Error al agregar curso: ${error.details}`);
        throw error;
    }
}

async function inscribirEstudiante(ciEstudiante, codigoCurso) {
    try {
        const response = await llamadaGrpc('InscribirEstudiante', {
            ci_estudiante: ciEstudiante,
            codigo_curso: codigoCurso
        });
        console.log(`✅ ${response.mensaje}`);
        return response;
    } catch (error) {
        console.error(`❌ Error al inscribir estudiante: ${error.details}`);
        throw error;
    }
}

async function listarCursosDeEstudiante(ci) {
    try {
        const response = await llamadaGrpc('ListarCursosDeEstudiante', { ci });
        console.log(`\n📚 ${response.mensaje}`);
        if (response.cursos && response.cursos.length > 0) {
            response.cursos.forEach((curso, index) => {
                console.log(`   ${index + 1}. ${curso.nombre} (${curso.codigo}) - Docente: ${curso.docente}`);
            });
        } else {
            console.log('   No está inscrito en ningún curso');
        }
        return response;
    } catch (error) {
        console.error(`❌ Error al listar cursos: ${error.details}`);
        throw error;
    }
}

async function listarEstudiantesDeCurso(codigo) {
    try {
        const response = await llamadaGrpc('ListarEstudiantesDeCurso', { codigo });
        console.log(`\n👥 ${response.mensaje}`);
        if (response.estudiantes && response.estudiantes.length > 0) {
            response.estudiantes.forEach((estudiante, index) => {
                console.log(`   ${index + 1}. ${estudiante.nombres} ${estudiante.apellidos} - CI: ${estudiante.ci} - Carrera: ${estudiante.carrera}`);
            });
        } else {
            console.log('   No hay estudiantes inscritos en este curso');
        }
        return response;
    } catch (error) {
        console.error(`❌ Error al listar estudiantes: ${error.details}`);
        throw error;
    }
}

// Demostración completa del sistema
async function demostracionCompleta() {
    console.log('🎓 INICIANDO DEMOSTRACIÓN DEL SISTEMA UNIVERSITARIO gRPC\n');
    console.log('=' .repeat(60));

    try {
        // 1. Registrar un estudiante
        console.log('\n1. 🆕 REGISTRANDO ESTUDIANTE');
        console.log('-'.repeat(40));
        const estudiante1 = {
            ci: '12345678',
            nombres: 'María',
            apellidos: 'Gonzalez',
            carrera: 'Ingeniería Informática'
        };
        await agregarEstudiante(estudiante1);

        // 2. Registrar dos cursos
        console.log('\n2. 📚 REGISTRANDO CURSOS');
        console.log('-'.repeat(40));
        
        const curso1 = {
            codigo: 'INF-101',
            nombre: 'Programación I',
            docente: 'Dr. Carlos Rodríguez'
        };
        await agregarCurso(curso1);

        const curso2 = {
            codigo: 'MAT-201',
            nombre: 'Cálculo Avanzado',
            docente: 'Dra. Ana Martínez'
        };
        await agregarCurso(curso2);

        const curso3 = {
            codigo: 'FIS-101',
            nombre: 'Física General',
            docente: 'Dr. Luis García'
        };
        await agregarCurso(curso3);

        // 3. Inscribir al estudiante en ambos cursos
        console.log('\n3. 🎓 REALIZANDO INSCRIPCIONES');
        console.log('-'.repeat(40));
        await inscribirEstudiante('12345678', 'INF-101');
        await inscribirEstudiante('12345678', 'MAT-201');
        
        // Intentar inscribir nuevamente (debe fallar)
        console.log('\n   🔄 Intentando inscribir en curso ya existente...');
        try {
            await inscribirEstudiante('12345678', 'INF-101');
        } catch (error) {
            console.log('   ✅ Correcto: El sistema previno inscripción duplicada');
        }

        // 4. Registrar otro estudiante y inscribirlo
        console.log('\n4. 🆕 REGISTRANDO SEGUNDO ESTUDIANTE');
        console.log('-'.repeat(40));
        const estudiante2 = {
            ci: '87654321',
            nombres: 'Juan',
            apellidos: 'Pérez',
            carrera: 'Matemáticas'
        };
        await agregarEstudiante(estudiante2);
        await inscribirEstudiante('87654321', 'INF-101');
        await inscribirEstudiante('87654321', 'FIS-101');

        // 5. Consultar los cursos del primer estudiante
        console.log('\n5. 📋 CONSULTANDO CURSOS DEL ESTUDIANTE 1');
        console.log('-'.repeat(40));
        await listarCursosDeEstudiante('12345678');

        // 6. Consultar los estudiantes del curso de Programación
        console.log('\n6. 👥 CONSULTANDO ESTUDIANTES DEL CURSO PROGRAMACIÓN I');
        console.log('-'.repeat(40));
        await listarEstudiantesDeCurso('INF-101');

        // 7. Consultar cursos del segundo estudiante
        console.log('\n7. 📋 CONSULTANDO CURSOS DEL ESTUDIANTE 2');
        console.log('-'.repeat(40));
        await listarCursosDeEstudiante('87654321');

        // 8. Consultar estudiantes de Física
        console.log('\n8. 👥 CONSULTANDO ESTUDIANTES DEL CURSO FÍSICA GENERAL');
        console.log('-'.repeat(40));
        await listarEstudiantesDeCurso('FIS-101');

        // 9. Pruebas de error
        console.log('\n9. 🧪 PRUEBAS DE MANEJO DE ERRORES');
        console.log('-'.repeat(40));
        
        console.log('   🔍 Intentando listar cursos de estudiante inexistente...');
        try {
            await listarCursosDeEstudiante('99999999');
        } catch (error) {
            console.log('   ✅ Correcto: El sistema manejó el estudiante no encontrado');
        }

        console.log('   🔍 Intentando listar estudiantes de curso inexistente...');
        try {
            await listarEstudiantesDeCurso('CURSO-INEXISTENTE');
        } catch (error) {
            console.log('   ✅ Correcto: El sistema manejó el curso no encontrado');
        }

        console.log('\n' + '=' .repeat(60));
        console.log('🎉 DEMOSTRACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('✨ Todos los servicios gRPC funcionan correctamente');

    } catch (error) {
        console.error('\n💥 Error durante la demostración:', error);
    }
}

// Ejecutar la demostración
demostracionCompleta();