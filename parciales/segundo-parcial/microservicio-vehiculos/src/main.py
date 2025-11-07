from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time

from src.config.settings import settings
from src.config.database import connect_to_mongo, close_mongo_connection
from src.routes import vehiculo_routes

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    logger.info(" Cerrando aplicación...")
    await close_mongo_connection()

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    ## Microservicio de Gestión de Vehículos
    
    API REST para gestionar vehículos de transporte con autenticación JWT

    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para logging de requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.2f}s"
    )
    
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"}
    )

# Incluimos rutas aqui.
app.include_router(vehiculo_routes.router)

@app.get(
    "/",
    tags=["Health"],
    summary="Health check",
    description="Verificar estado del servicio"
)
async def root():
    """
    Endpoint de verificación del estado del servicio.
    """
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check
@app.get(
    "/health",
    tags=["Health"],
    summary="Health check detallado",
    description="Verificar estado del servicio y sus dependencias"
)
async def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug
    )