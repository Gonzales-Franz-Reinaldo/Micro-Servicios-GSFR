use sqlx::FromRow;
use chrono::{DateTime, Utc};       
use async_graphql::SimpleObject;   

#[derive(Debug, Clone, FromRow, SimpleObject)]
pub struct Alumno {
    pub id: i32,
    pub nombre: String,
    pub apellido: String,
    pub email: String,
    pub edad: i32,
    pub carrera: String,
    pub semestre: i32,
    pub promedio: f64,
    pub activo: bool,
    pub fecha_registro: DateTime<Utc>,       
    pub fecha_actualizacion: DateTime<Utc>,  
}
