use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct Alumno {
    pub id: i32,
    pub nombre: String,
    pub apellido: String,
    pub email: String,
    pub edad: i32,
    pub carrera: String,
    pub semestre: i32,
    pub promedio: f64,  // Volver a f64 simple
    pub activo: bool,
    pub fecha_registro: DateTime<Utc>,
    pub fecha_actualizacion: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct CreateAlumnoRequest {
    #[validate(length(min = 2, max = 100, message = "Nombre debe tener entre 2 y 100 caracteres"))]
    pub nombre: String,
    
    #[validate(length(min = 2, max = 100, message = "Apellido debe tener entre 2 y 100 caracteres"))]
    pub apellido: String,
    
    #[validate(email(message = "Email inválido"))]
    pub email: String,
    
    #[validate(range(min = 16, max = 65, message = "Edad debe estar entre 16 y 65 años"))]
    pub edad: i32,
    
    #[validate(length(min = 5, max = 100, message = "Carrera debe tener entre 5 y 100 caracteres"))]
    pub carrera: String,
    
    #[validate(range(min = 1, max = 10, message = "Semestre debe estar entre 1 y 10"))]
    pub semestre: i32,
    
    #[validate(range(min = 0.0, max = 10.0, message = "Promedio debe estar entre 0.0 y 10.0"))]
    pub promedio: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateAlumnoRequest {
    #[validate(length(min = 2, max = 100, message = "Nombre debe tener entre 2 y 100 caracteres"))]
    pub nombre: Option<String>,
    
    #[validate(length(min = 2, max = 100, message = "Apellido debe tener entre 2 y 100 caracteres"))]
    pub apellido: Option<String>,
    
    #[validate(email(message = "Email inválido"))]
    pub email: Option<String>,
    
    #[validate(range(min = 16, max = 65, message = "Edad debe estar entre 16 y 65 años"))]
    pub edad: Option<i32>,
    
    #[validate(length(min = 5, max = 100, message = "Carrera debe tener entre 5 y 100 caracteres"))]
    pub carrera: Option<String>,
    
    #[validate(range(min = 1, max = 10, message = "Semestre debe estar entre 1 y 10"))]
    pub semestre: Option<i32>,
    
    #[validate(range(min = 0.0, max = 10.0, message = "Promedio debe estar entre 0.0 y 10.0"))]
    pub promedio: Option<f64>,
    
    pub activo: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct AlumnoResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<Alumno>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct AlumnosResponse {
    pub success: bool,
    pub message: String,
    pub data: Vec<Alumno>,
    pub total: i64,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ErrorResponse {
    pub success: bool,
    pub message: String,
    pub errors: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationQuery {
    pub page: Option<i32>,
    pub limit: Option<i32>,
    pub search: Option<String>,
    pub carrera: Option<String>,
    pub activo: Option<bool>,
}