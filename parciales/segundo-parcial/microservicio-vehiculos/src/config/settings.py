from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "microservicio de Vehículos"
    # app_name: str = "Proyecto de microservicios V1"
    app_version: str = "1.0.0"
    port: int = 8000
    debug: bool = True
    
    # configuramos MongoDB
    mongodb_url: str
    mongodb_db_name: str
    
    # configuaraciones
    # mysql_url: str
    # mysql_db_name: str

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    
    auth_service_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()