from fastapi import HTTPException, status
from src.config.database import get_database
from src.models.vehiculo import VehiculoCreate, VehiculoUpdate, VehiculoResponse
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class VehiculoController:
    
    
    # async def create_viaje(viaje: ViajeCreate) -> ViajeResponse:
        
    #     try:
    #         db = get_database()
    #         collection = db.viajes  
            
    #         existing = await collection.find_one({"codigo_viaje": viaje.codigo_viaje})
    #         if existing:
    #             raise HTTPException(
    #                 status_code=status.HTTP_400_BAD_REQUEST,
    #                 detail=f"Ya existe un viaje con el código: {viaje.codigo_viaje}"
    #             )
            
    #         # Preparación de datos y timestamps
    #         viaje_dict = viaje.model_dump()
    #         viaje_dict["created_at"] = datetime.utcnow()
    #         viaje_dict["updated_at"] = datetime.utcnow()
            
    #         # Inserción en la base de datos
    #         result = await collection.insert_one(viaje_dict)
            
    #     except Exception as e:
    #         # Manejo de cualquier otro error inesperado
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail="Error al crear el viaje"
    #         )
    
    @staticmethod
    async def create_vehiculo(vehiculo: VehiculoCreate) -> VehiculoResponse:
        try:
            db = get_database()
            collection = db.vehiculos
            
            existing = await collection.find_one({"placa": vehiculo.placa})
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un vehículo con la placa: {vehiculo.placa}"
                )
            
            vehiculo_dict = vehiculo.model_dump()
            vehiculo_dict["created_at"] = datetime.utcnow()
            vehiculo_dict["updated_at"] = datetime.utcnow()
            
            result = await collection.insert_one(vehiculo_dict)
            
            created_vehiculo = await collection.find_one({"_id": result.inserted_id})
            
            return VehiculoResponse(**created_vehiculo)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear vehículo"
            )
    
    @staticmethod
    async def get_all_vehiculos(
        tipo: Optional[str] = None,
        estado: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[VehiculoResponse]:
        try:
            db = get_database()
            collection = db.vehiculos
            
            filters = {}
            if tipo:
                filters["tipo"] = tipo
            if estado:
                filters["estado"] = estado
                
            # cursor = collection.find(filters).skip(skip)
            # vehiculos = await cursor.to_list(.)
            
            cursor = collection.find(filters).skip(skip).limit(limit).sort("created_at", -1)
            vehiculos = await cursor.to_list(length=limit)
            
            
            return [VehiculoResponse(**vehiculo) for vehiculo in vehiculos]
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al obtener vehículos"
            )
    
    @staticmethod
    async def get_vehiculo_by_id(vehiculo_id: str) -> VehiculoResponse:
        try:
            if not ObjectId.is_valid(vehiculo_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="ID de vehículo inválido"
                )
            
            db = get_database()
            collection = db.vehiculos
            
            vehiculo = await collection.find_one({"_id": ObjectId(vehiculo_id)})
           
        #    if not vehiculo:
        #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        #             detail=f"Vehículo no encontrado con ID: {vehiculo_id}"
        #         ) 
            
            if not vehiculo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Vehículo no encontrado con ID: {vehiculo_id}"
                )
            
            return VehiculoResponse(**vehiculo)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al obtener vehículo"
            )
            
            


    # @staticmethod
    # async def update_viaje(viaje_id: str, viaje_update: ViajeUpdate) -> ViajeResponse:
    #     try:
    #         if not ObjectId.is_valid(viaje_id):
    #             raise HTTPException(
    #                 status_code=status.HTTP_400_BAD_REQUEST,
    #                 detail="ID de viaje inválido"
    #             )
            
    #         db = get_database()
    #         collection = db.viajes
            
    #         existing = await collection.find_one({"_id": ObjectId(viaje_id)})
    #         if not existing:
    #             raise HTTPException(
    #                 status_code=status.HTTP_404_NOT_FOUND,
    #                 detail=f"Viaje no encontrado con ID: {viaje_id}"
    #             )

            
    #         updated_viaje = await collection.find_one({"_id": ObjectId(viaje_id)})
            
    #         return ViajeResponse(**updated_viaje)
            
    #     except HTTPException:
    #         raise
    #     except Exception as e:
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail="Error al actualizar viaje"
    #         )
    
    @staticmethod
    async def update_vehiculo(vehiculo_id: str, vehiculo_update: VehiculoUpdate) -> VehiculoResponse:
        try:
            if not ObjectId.is_valid(vehiculo_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="ID de vehículo inválido"
                )
            
            db = get_database()
            collection = db.vehiculos
            
            existing = await collection.find_one({"_id": ObjectId(vehiculo_id)})
            if not existing:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Vehículo no encontrado con ID: {vehiculo_id}"
                )
            
            if vehiculo_update.placa and vehiculo_update.placa != existing["placa"]:
                placa_exists = await collection.find_one({
                    "placa": vehiculo_update.placa,
                    "_id": {"$ne": ObjectId(vehiculo_id)}
                })
                if placa_exists:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Ya existe un vehículo con la placa: {vehiculo_update.placa}"
                    )
            
            update_data = {k: v for k, v in vehiculo_update.model_dump().items() if v is not None}
            
            if update_data:
                update_data["updated_at"] = datetime.utcnow()
                
                await collection.update_one(
                    {"_id": ObjectId(vehiculo_id)},
                    {"$set": update_data}
                )
            
            updated_vehiculo = await collection.find_one({"_id": ObjectId(vehiculo_id)})
            
            return VehiculoResponse(**updated_vehiculo)
            
        except HTTPException:
            raise
        except Exception as e:
            # raise HTTPException(
            #     status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            #     detail="erroa al actualizar viaje"
            # )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar vehículo"
            )
    
    @staticmethod
    async def delete_vehiculo(vehiculo_id: str) -> dict:
        try:
            if not ObjectId.is_valid(vehiculo_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="ID de vehículo inválido"
                )
            
            db = get_database()
            collection = db.vehiculos
            
            vehiculo = await collection.find_one({"_id": ObjectId(vehiculo_id)})
            if not vehiculo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Vehículo no encontrado con ID: {vehiculo_id}"
                )
            
            await collection.delete_one({"_id": ObjectId(vehiculo_id)})
            
            return {
                "message": "Vehículo eliminado exitosamente",
                "placa": vehiculo["placa"]
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar vehículo"
            )
    
    @staticmethod
    async def get_vehiculos_disponibles() -> List[VehiculoResponse]:
        return await VehiculoController.get_all_vehiculos(estado="disponible")
    
    @staticmethod
    async def cambiar_estado_vehiculo(vehiculo_id: str, nuevo_estado: str) -> VehiculoResponse:
        estados_validos = ["disponible", "en ruta", "mantenimiento"]
        
        # if nuevo_estado not in estados_validos:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        if nuevo_estado not in estados_validos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Debe ser: {', '.join(estados_validos)}"
            )
        
        return await VehiculoController.update_vehiculo(
            vehiculo_id,
            VehiculoUpdate(estado=nuevo_estado)
        )