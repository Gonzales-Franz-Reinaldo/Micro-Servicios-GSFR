from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class VehiculoBase(BaseModel):

    # ruta: str = Field(..., description="numero de ruta del vehículo", min_length=6, max_length=10)
    # destino: Literal["lugar"] = Field(..., description="Destino de viaje")
    # estado: float = Field(..., gt=0, description="Estado viaje")
    
    placa: str = Field(..., description="numero de placa del vehículo", min_length=6, max_length=10)
    tipo: Literal["camion", "furgon", "moto"] = Field(..., description="Tipo de vehículo")
    capacidad: float = Field(..., gt=0, description="Capacidad de carga en kg")
    estado: Literal["disponible", "en ruta", "mantenimiento"] = Field(
        default="disponible",
        description="Estado actual del vehículo"
    )
    
    @validator('placa')
    def placa_uppercase(cls, v):
        return v.upper().strip()
    
    # @validator('estado')
    # def estado_uppercase(cls, v):
    #     return v.upper().strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "placa": "ABC-1234",
                "tipo": "camion",
                "capacidad": 5000.0,
                "estado": "disponible"
            }
        }

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoUpdate(BaseModel):
    placa: Optional[str] = Field(None, min_length=6, max_length=10)
    tipo: Optional[Literal["camion", "furgon", "moto"]] = None
    capacidad: Optional[float] = Field(None, gt=0)
    estado: Optional[Literal["disponible", "en ruta", "mantenimiento"]] = None
    
    @validator('placa')
    def placa_uppercase(cls, v):
        if v:
            return v.upper().strip()
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "estado": "en ruta"
            }
        }

class VehiculoInDB(VehiculoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class VehiculoResponse(BaseModel):
    id: str = Field(..., alias="_id")
    placa: str
    tipo: str
    capacidad: float
    estado: str
    created_at: datetime
    updated_at: datetime
    
    
    # class Config:
    #     populate_by_name = True
    #     json_schema_extra = {"example": { "_id": "507f1f77bcf86cd799439011",
    #         }
    #     }
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "placa": "ABC-1234",
                "tipo": "camion",
                "capacidad": 5000.0,
                "estado": "disponible",
                "created_at": "2024-11-06T15:30:00Z",
                "updated_at": "2024-11-06T15:30:00Z"
            }
        }