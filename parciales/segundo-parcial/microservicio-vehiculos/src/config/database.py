from motor.motor_asyncio import AsyncIOMotorClient
from src.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    try:
        # db.client = AsyncIOMotorClient(settings.mysql_url)
        # db.db = db.client[settings.mysql_db_name]
        
        await db.client.admin.command('ping')
        await create_indexes()
        
        db.client = AsyncIOMotorClient(settings.mongodb_url)
        db.db = db.client[settings.mongodb_db_name]
        
        await db.client.admin.command('ping')
        await create_indexes()
        
    except Exception as e:
        logger.error(f" Error al conectar a MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Cerrar conexión a MongoDB"""
    if db.client:
        db.client.close()

async def create_indexes():
    try:
        
        # viajes_collection = db.db.viajes
        
        # await viajes_collection.create_index("rutas", unique=True)
        
        # await viajes_collection.create_index("tipo_viaje")
        # await viajes_collection.create_index("estado")
        
        vehiculos_collection = db.db.vehiculos
        
        await vehiculos_collection.create_index("placa", unique=True)
        
        await vehiculos_collection.create_index("tipo")
        await vehiculos_collection.create_index("estado")
        
    except Exception as e:
        logger.warning(f"  error al crear índices: {e}")

def get_database():
    return db.db