import axios from 'axios';
import config from '../config/config';
import logger from '../utils/logger';
import { Usuario } from '../models/notificacion.model';

class UsuariosClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = config.services.usuarios;
    }

    /**
     * Obtiene datos de un usuario por ID
     */
    async getUsuario(usuarioId: string): Promise<Usuario | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/v1/users/${usuarioId}`, {
                timeout: 5000,
            });

            if (response.status === 200) {
                return response.data;
            }

            logger.warn(`Usuario ${usuarioId} no encontrado`);
            return null;
        } catch (error: any) {
            if (error.response?.status === 404) {
                logger.warn(`Usuario ${usuarioId} no encontrado`);
                return null;
            }
            logger.error(`Error al obtener usuario ${usuarioId}: ${error.message}`);
            return null;
        }
    }
}

export default new UsuariosClient();