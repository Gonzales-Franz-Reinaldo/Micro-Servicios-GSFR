import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";

// Cargar el proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// Crear cliente
const client = new proto.UniversidadService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

// 1. Agregar estudiante
client.AgregarEstudiante(
    { ci: "12345", nombres: "Carlos", apellidos: "Montellano", carrera: "Sistemas" },
    (err, response) => {
        if (err) return console.error("Error al agregar estudiante:", err);
        console.log("Estudiante agregado:", response.estudiante);

        // 2. Agregar primer curso
        client.AgregarCurso(
            { codigo: "CS101", nombre: "Introducción a la Programación", docente: "Dr. Smith" },
            (err, response) => {
                if (err) return console.error("Error al agregar curso 1:", err);
                console.log("Curso 1 agregado:", response.curso);

                // 3. Agregar segundo curso
                client.AgregarCurso(
                    { codigo: "CS202", nombre: "Bases de Datos", docente: "Dr. Johnson" },
                    (err, response) => {
                        if (err) return console.error("Error al agregar curso 2:", err);
                        console.log("Curso 2 agregado:", response.curso);

                        // 4. Inscribir en primer curso
                        client.InscribirEstudiante(
                            { ci: "12345", codigo: "CS101" },
                            (err, response) => {
                                if (err) return console.error("Error al inscribir en curso 1:", err);
                                console.log("Inscripción en curso 1:", response.mensaje);

                                // 5. Inscribir en segundo curso
                                client.InscribirEstudiante(
                                    { ci: "12345", codigo: "CS202" },
                                    (err, response) => {
                                        if (err) return console.error("Error al inscribir en curso 2:", err);
                                        console.log("Inscripción en curso 2:", response.mensaje);

                                        // 6. Listar cursos del estudiante
                                        client.ListarCursosDeEstudiante(
                                            { ci: "12345" },
                                            (err, response) => {
                                                if (err) return console.error("Error al listar cursos del estudiante:", err);
                                                console.log("Cursos del estudiante:", response.cursos);

                                                // 7. Listar estudiantes del primer curso
                                                client.ListarEstudiantesDeCurso(
                                                    { codigo: "CS101" },
                                                    (err, response) => {
                                                        if (err) return console.error("Error al listar estudiantes del curso:", err);
                                                        console.log("Estudiantes en curso CS101:", response.estudiantes);
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);