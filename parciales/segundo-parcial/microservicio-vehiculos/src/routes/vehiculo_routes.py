from fastapi import APIRouter, Depends, Query, Path, Body
from src.controllers.vehiculo_controller import VehiculoController
from src.models.vehiculo import VehiculoCreate, VehiculoUpdate, VehiculoResponse
from src.middleware.auth import get_current_user
from typing import List, Optional

router = APIRouter(
    # prefix="/api/v1/viajes",
    # tags=["Viajes"],
    prefix="/api/v1/vehiculos",
    tags=["Vehículos"],
    dependencies=[Depends(get_current_user)]
)

@router.post(
    "/",
    response_model=VehiculoResponse,
    status_code=201,
    summary="Crear vehículo",
    description="Crear un nuevo vehículo en el sistema",
    response_description="Vehículo creado exitosamente"
)
async def create_vehiculo(
    vehiculo: VehiculoCreate = Body(..., description="Datos del vehículo a crear"),
    current_user: dict = Depends(get_current_user)
):
    return await VehiculoController.create_vehiculo(vehiculo)

@router.get(
    "/",
    response_model=List[VehiculoResponse],
    summary="Listar vehículos",
    description="Obtener listado de todos los vehículos con filtros opcionales",
    response_description="Lista de vehículos"
)
async def get_all_vehiculos(
    
    # Atributos específicos para el filtrado de viajes (Comentados para simplificar el endpoint)
    # origen: Optional[str] = Query(None, description="Filtrar por punto de origen"),
    # destino: Optional[str] = Query(None, description="Filtrar por punto de destino"),
    # fecha_inicio: Optional[datetime] = Query(None, description="Filtrar por fecha de inicio posterior a")
    
    tipo: Optional[str] = Query(None, description="Filtrar por tipo de vehículo", enum=["camion", "furgon", "moto"]),
    estado: Optional[str] = Query(None, description="Filtrar por estado", enum=["disponible", "en ruta", "mantenimiento"]),
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Límite de registros a retornar"),
    current_user: dict = Depends(get_current_user)
):

    return await VehiculoController.get_all_vehiculos(tipo, estado, skip, limit)


# @router.get(
#     "/disponibles",
#     response_model=List[ViajeResponse],
#     summary="Listar viajes disponibles",
#     description="Obtener listado de viajes con estado 'disponible'",
#     response_description="Lista de viajes disponibles"
# )
# async def get_viajes_disponibles(
#     current_user: dict = Depends(get_current_user)
# ):
#     # return await VehiculoController.get_vehiculos_disponibles()
#     return await ViajeController.get_viajes_disponibles()

@router.get(
    "/disponibles",
    response_model=List[VehiculoResponse],
    summary="Listar vehículos disponibles",
    description="Obtener listado de vehículos con estado 'disponible'",
    response_description="Lista de vehículos disponibles"
)
async def get_vehiculos_disponibles(
    current_user: dict = Depends(get_current_user)
):
    return await VehiculoController.get_vehiculos_disponibles()

@router.get(
    "/{vehiculo_id}",
    response_model=VehiculoResponse,
    summary="Obtener vehículo por ID",
    description="Obtener detalles de un vehículo específico",
    response_description="Detalles del vehículo"
)
async def get_vehiculo_by_id(
    vehiculo_id: str = Path(..., description="ID del vehículo a obtener"),
    current_user: dict = Depends(get_current_user)
):

    return await VehiculoController.get_vehiculo_by_id(vehiculo_id)

@router.put(
    "/{vehiculo_id}",
    response_model=VehiculoResponse,
    summary="Actualizar vehículo",
    description="Actualizar datos de un vehículo existente",
    response_description="Vehículo actualizado"
)
async def update_vehiculo(
    vehiculo_id: str = Path(..., description="ID del vehículo a actualizar"),
    vehiculo_update: VehiculoUpdate = Body(..., description="Datos a actualizar"),
    current_user: dict = Depends(get_current_user)
):
    return await VehiculoController.update_vehiculo(vehiculo_id, vehiculo_update)

@router.patch(
    "/{vehiculo_id}/estado",
    response_model=VehiculoResponse,
    summary="Cambiar estado del vehículo",
    description="Cambiar el estado de un vehículo",
    response_description="Vehículo con estado actualizado"
)
async def cambiar_estado_vehiculo(
    vehiculo_id: str = Path(..., description="ID del vehículo"),
    nuevo_estado: str = Body(..., embed=True, description="Nuevo estado del vehículo", enum=["disponible", "en ruta", "mantenimiento"]),
    current_user: dict = Depends(get_current_user)
):

    return await VehiculoController.cambiar_estado_vehiculo(vehiculo_id, nuevo_estado)

# @router.patch(
#     "/{viaje_id}/estado",
#     response_model=ViajeResponse,
#     summary="Cambiar estado del viaje",
#     description="Cambiar el estado de un viaje",
#     response_description="Viaje con estado actualizado"
# )
# async def cambiar_estado_viaje(
#     viaje_id: str = Path(..., description="ID del viaje"),
#     nuevo_estado: str = Body(..., embed=True, description="Nuevo estado del viaje", enum=["iniciado", "en curso", "finalizado", "cancelado"]),
#     current_user: dict = Depends(get_current_user)
# ):
#     # return await VehiculoController.cambiar_estado_vehiculo(vehiculo_id, nuevo_estado)
#

@router.delete(
    "/{vehiculo_id}",
    summary="Eliminar vehículo",
    description="Eliminar un vehículo del sistema",
    response_description="Confirmación de eliminación"
)
async def delete_vehiculo(
    vehiculo_id: str = Path(..., description="ID del vehículo a eliminar"),
    current_user: dict = Depends(get_current_user)
):
    # return await VehiculoController.delete_vehiculo(vehiculo_id)
    return await VehiculoController.delete_vehiculo(vehiculo_id)