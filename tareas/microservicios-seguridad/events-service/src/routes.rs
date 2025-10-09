use actix_web::{delete, get, post, put, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use crate::auth::Claims;
use crate::db::MyPool;
use crate::errors::AppError;
use crate::models::{Evento, EventoInput};
use serde_json::json;
use bigdecimal::BigDecimal;  
use std::str::FromStr;

fn es_admin(c: &Claims) -> bool {
    c.role == "admin"
}

fn require_admin(req: &HttpRequest) -> Result<Claims, AppError> {
    let claims = req
        .extensions()
        .get::<Claims>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("Token no encontrado".to_string()))?;
    
    if !es_admin(&claims) {
        return Err(AppError::Unauthorized("Requiere rol de administrador".to_string()));
    }
    
    Ok(claims)
}

// RUTAS PÚBLICAS
#[get("/")]
pub async fn home() -> impl Responder {
    tracing::info!("Endpoint raíz accedido");
    HttpResponse::Ok().json(json!({
        "servicio": "eventos",
        "status": "ok",
        "version": "1.0.0",
        "endpoints_publicos": [
            "GET /",
            "GET /eventos",
            "GET /eventos/{id}"
        ],
        "endpoints_admin": [
            "POST /eventos",
            "PUT /eventos/{id}",
            "DELETE /eventos/{id}"
        ]
    }))
}

#[get("/eventos")]
pub async fn listar_eventos(pool: web::Data<MyPool>) -> Result<HttpResponse, AppError> {
    tracing::info!("Listando todos los eventos");
    
    let eventos = sqlx::query_as::<_, Evento>(
        r#"SELECT id, nombre, fecha, lugar, capacidad, precio, creado_por, creado_en
           FROM eventos 
           WHERE fecha >= NOW()
           ORDER BY fecha ASC"#,
    )
    .fetch_all(pool.get_ref())
    .await
    .map_err(|e| {
        tracing::error!("Error al listar eventos: {:?}", e);
        AppError::DatabaseError(format!("Error al listar eventos: {}", e))
    })?;

    tracing::info!("Se encontraron {} eventos", eventos.len());
    Ok(HttpResponse::Ok().json(json!({
        "total": eventos.len(),
        "eventos": eventos
    })))
}

#[get("/eventos/{id}")]
pub async fn obtener_evento(
    pool: web::Data<MyPool>,
    id: web::Path<i32>, 
) -> Result<HttpResponse, AppError> {
    let evento_id = id.into_inner();
    tracing::info!("Obteniendo evento con ID: {}", evento_id);

    let evento = sqlx::query_as::<_, Evento>(
        r#"SELECT id, nombre, fecha, lugar, capacidad, precio, creado_por, creado_en
           FROM eventos WHERE id = ?"#,
    )
    .bind(evento_id)
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        tracing::error!("Error al obtener evento {}: {:?}", evento_id, e);
        AppError::DatabaseError(format!("Error al obtener evento: {}", e))
    })?
    .ok_or_else(|| AppError::NotFound(format!("Evento con ID {} no encontrado", evento_id)))?;

    tracing::info!("Evento encontrado: {}", evento.nombre);
    Ok(HttpResponse::Ok().json(evento))
}

// RUTAS PROTEGIDAS (ADMIN)
#[post("/eventos")]
pub async fn crear_evento(
    pool: web::Data<MyPool>,
    body: web::Json<EventoInput>,
    req: HttpRequest,
) -> Result<HttpResponse, AppError> {
    let claims = require_admin(&req)?;
    
    tracing::info!("Admin {} creando nuevo evento", claims.id); 
    
    // Validar datos
    body.validate()?;

    //  Convertir f64 a BigDecimal
    let precio_decimal = BigDecimal::from_str(&body.precio.to_string())
        .map_err(|_| AppError::ValidationError("Precio inválido".to_string()))?;

    let result = sqlx::query(
        r#"INSERT INTO eventos (nombre, fecha, lugar, capacidad, precio, creado_por)
           VALUES (?, ?, ?, ?, ?, ?)"#,
    )
    .bind(&body.nombre)
    .bind(&body.fecha)
    .bind(&body.lugar)
    .bind(body.capacidad)
    .bind(&precio_decimal)  
    .bind(&claims.id) 
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        tracing::error!("Error al crear evento: {:?}", e);
        AppError::DatabaseError(format!("Error al crear evento: {}", e))
    })?;

    let id = result.last_insert_id() as i32;
    tracing::info!("Evento creado exitosamente con ID: {}", id);

    Ok(HttpResponse::Created().json(json!({
        "message": "Evento creado exitosamente",
        "evento": {
            "id": id,
            "nombre": body.nombre,
            "fecha": body.fecha,
            "lugar": body.lugar,
            "capacidad": body.capacidad,
            "precio": body.precio,
            "creado_por": claims.id  
        }})))
}

#[put("/eventos/{id}")]
pub async fn actualizar_evento(
    pool: web::Data<MyPool>,
    id: web::Path<i32>, 
    body: web::Json<EventoInput>,
    req: HttpRequest,
) -> Result<HttpResponse, AppError> {
    let claims = require_admin(&req)?;
    let evento_id = id.into_inner();
    
    tracing::info!("Admin {} actualizando evento {}", claims.id, evento_id); 
    
    // Validar datos
    body.validate()?;

    //  Convertir f64 a BigDecimal
    let precio_decimal = BigDecimal::from_str(&body.precio.to_string())
        .map_err(|_| AppError::ValidationError("Precio inválido".to_string()))?;

    let result = sqlx::query(
        r#"UPDATE eventos
           SET nombre = ?, fecha = ?, lugar = ?, capacidad = ?, precio = ?
           WHERE id = ?"#,
    )
    .bind(&body.nombre)
    .bind(&body.fecha)
    .bind(&body.lugar)
    .bind(body.capacidad)
    .bind(&precio_decimal)
    .bind(evento_id)
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        tracing::error!("Error al actualizar evento {}: {:?}", evento_id, e);
        AppError::DatabaseError(format!("Error al actualizar evento: {}", e))
    })?;

    if result.rows_affected() == 0 {
        tracing::warn!("Intento de actualizar evento inexistente: {}", evento_id);
        return Err(AppError::NotFound(format!("Evento con ID {} no encontrado", evento_id)));
    }

    tracing::info!("Evento {} actualizado exitosamente", evento_id);
    Ok(HttpResponse::Ok().json(json!({
        "message": "Evento actualizado exitosamente",
        "id": evento_id
    })))
}

#[delete("/eventos/{id}")]
pub async fn eliminar_evento(
    pool: web::Data<MyPool>,
    id: web::Path<i32>,
    req: HttpRequest,
) -> Result<HttpResponse, AppError> {
    let claims = require_admin(&req)?;
    let evento_id = id.into_inner();
    
    tracing::info!("Admin {} eliminando evento {}", claims.id, evento_id);  

    let result = sqlx::query(r#"DELETE FROM eventos WHERE id = ?"#)
        .bind(evento_id)
        .execute(pool.get_ref())
        .await
        .map_err(|e| {
            tracing::error!("Error al eliminar evento {}: {:?}", evento_id, e);
            AppError::DatabaseError(format!("Error al eliminar evento: {}", e))
        })?;

    if result.rows_affected() == 0 {
        tracing::warn!("Intento de eliminar evento inexistente: {}", evento_id);
        return Err(AppError::NotFound(format!("Evento con ID {} no encontrado", evento_id)));
    }

    tracing::info!("Evento {} eliminado exitosamente", evento_id);
    Ok(HttpResponse::Ok().json(json!({
        "message": "Evento eliminado exitosamente",
        "id": evento_id
    })))
}
