const { AppDataSource } = require('../config/database');
const Medico = require('../entities/Medico');

class MedicoController {
    // Obtener todos los médicos
    async getAll(req, res) {
        try {
            const medicoRepository = AppDataSource.getRepository(Medico);
            const medicos = await medicoRepository.find();
            
            res.status(200).json({
                success: true,
                data: medicos,
                total: medicos.length
            });
        } catch (error) {
            console.error('Error al obtener médicos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    //  Obtener un médico específico
    async getById(req, res) {
        try {
            const { id } = req.params;
            const medicoRepository = AppDataSource.getRepository(Medico);
            const medico = await medicoRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!medico) {
                return res.status(404).json({
                    success: false,
                    message: 'Médico no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: medico
            });
        } catch (error) {
            console.error('Error al obtener médico:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Crear un nuevo médico
    async create(req, res) {
        try {
            const { nombre, apellido, cedula_profesional, anos_experiencia, correo_electronico } = req.body;

            // Validaciones 
            if (!nombre || !apellido || !cedula_profesional || !correo_electronico) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre, apellido, cedula_profesional y correo_electronico son obligatorios'
                });
            }

            const medicoRepository = AppDataSource.getRepository(Medico);
            
            // Verificar si ya existe un médico con la misma cédula o correo
            const existeMedico = await medicoRepository.findOne({
                where: [
                    { cedula_profesional },
                    { correo_electronico }
                ]
            });

            if (existeMedico) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un médico con esa cédula profesional o correo electrónico'
                });
            }

            const nuevoMedico = medicoRepository.create({
                nombre,
                apellido,
                cedula_profesional,
                anos_experiencia: anos_experiencia || 0,
                correo_electronico
            });

            const medicoGuardado = await medicoRepository.save(nuevoMedico);

            res.status(201).json({
                success: true,
                message: 'Médico creado exitosamente',
                data: medicoGuardado
            });
        } catch (error) {
            console.error('Error al crear médico:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Actualizar un médico
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, apellido, cedula_profesional, anos_experiencia, correo_electronico } = req.body;

            const medicoRepository = AppDataSource.getRepository(Medico);
            
            const medico = await medicoRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!medico) {
                return res.status(404).json({
                    success: false,
                    message: 'Médico no encontrado'
                });
            }

            // Verificar duplicados si se está actualizando cédula o correo
            if (cedula_profesional && cedula_profesional !== medico.cedula_profesional) {
                const existeCedula = await medicoRepository.findOne({
                    where: { cedula_profesional }
                });
                if (existeCedula) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe un médico con esa cédula profesional'
                    });
                }
            }

            if (correo_electronico && correo_electronico !== medico.correo_electronico) {
                const existeCorreo = await medicoRepository.findOne({
                    where: { correo_electronico }
                });
                if (existeCorreo) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe un médico con ese correo electrónico'
                    });
                }
            }

            // Actualizar campos
            if (nombre) medico.nombre = nombre;
            if (apellido) medico.apellido = apellido;
            if (cedula_profesional) medico.cedula_profesional = cedula_profesional;
            if (anos_experiencia !== undefined) medico.anos_experiencia = anos_experiencia;
            if (correo_electronico) medico.correo_electronico = correo_electronico;

            const medicoActualizado = await medicoRepository.save(medico);

            res.status(200).json({
                success: true,
                message: 'Médico actualizado exitosamente',
                data: medicoActualizado
            });
        } catch (error) {
            console.error('Error al actualizar médico:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Eliminar un médico
    async delete(req, res) {
        try {
            const { id } = req.params;
            const medicoRepository = AppDataSource.getRepository(Medico);

            const medico = await medicoRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!medico) {
                return res.status(404).json({
                    success: false,
                    message: 'Médico no encontrado'
                });
            }

            await medicoRepository.remove(medico);

            res.status(200).json({
                success: true,
                message: 'Médico eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar médico:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new MedicoController();
