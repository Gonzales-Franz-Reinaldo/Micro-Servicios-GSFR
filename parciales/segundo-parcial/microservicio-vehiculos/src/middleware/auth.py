from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from src.config.settings import settings
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verificar token JWT
    """
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        
        user_id: str = payload.get("id")
        user_email: str = payload.get("correo")
        
        if user_id is None or user_email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: datos incompletos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f" Token verificado para usuario: {user_email}")
        
        # verificación de roles de un proyecto anterior 
        # ALLOWED_ROLES = ["admin", "supervisor", "operador"] 
        
        # if role_name not in ALLOWED_ROLES:
        #     logger.warning(f" Acceso denegado a usuario {user_email} con rol no permitido: {role_name}")
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Permisos insuficientes",
        #     )
        
        # # user_data = await get_user_from_db(user_id)
        
        return {
            "id": user_id,
            "correo": user_email
        }
        
    except JWTError as e:
        logger.error(f" Error al verificar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f" Error inesperado al verificar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al verificar autenticación"
        )

def get_current_user(user = Depends(verify_token)):
    return user