use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
};
use sqlx::{MySql, Pool};
use validator::Validate;

use crate::models::*;

/// Obtener todos los alumnos con paginación y filtros
#[utoipa::path(
    get,
    path = "/api/alumnos",
    params(
        ("page" = Option<i32>, Query, description = "Número de página (default: 1)"),
        ("limit" = Option<i32>, Query, description = "Elementos por página (default: 10)"),
        ("search" = Option<String>, Query, description = "Búsqueda por nombre o apellido"),
        ("carrera" = Option<String>, Query, description = "Filtrar por carrera"),
        ("activo" = Option<bool>, Query, description = "Filtrar por estatus activo")
    ),
    responses(
        (status = 200, description = "Lista de alumnos", body = AlumnosResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn get_alumnos(
    State(pool): State<Pool<MySql>>,
    Query(params): Query<PaginationQuery>,
) -> Result<Json<AlumnosResponse>, (StatusCode, Json<ErrorResponse>)> {
    let page = params.page.unwrap_or(1).max(1);
    let limit = params.limit.unwrap_or(10).min(100).max(1);
    let offset = (page - 1) * limit;

    let mut query = "SELECT * FROM alumnos WHERE 1=1".to_string();
    let mut count_query = "SELECT COUNT(*) as total FROM alumnos WHERE 1=1".to_string();
    
    if let Some(search) = &params.search {
        let search_condition = format!(" AND (nombre LIKE '%{}%' OR apellido LIKE '%{}%')", search, search);
        query.push_str(&search_condition);
        count_query.push_str(&search_condition);
    }
    
    if let Some(carrera) = &params.carrera {
        let carrera_condition = format!(" AND carrera = '{}'", carrera);
        query.push_str(&carrera_condition);
        count_query.push_str(&carrera_condition);
    }
    
    if let Some(activo) = params.activo {
        let activo_condition = format!(" AND activo = {}", activo);
        query.push_str(&activo_condition);
        count_query.push_str(&activo_condition);
    }

    query.push_str(" ORDER BY fecha_registro DESC");
    query.push_str(&format!(" LIMIT {} OFFSET {}", limit, offset));

    match sqlx::query_as::<_, Alumno>(&query).fetch_all(&pool).await {
        Ok(alumnos) => {
            let total: (i64,) = sqlx::query_as(&count_query).fetch_one(&pool).await
                .unwrap_or((0,));

            Ok(Json(AlumnosResponse {
                success: true,
                message: "Alumnos obtenidos exitosamente".to_string(),
                data: alumnos,
                total: total.0,
            }))
        }
        Err(e) => {
            tracing::error!("Error al obtener alumnos: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// Obtener un alumno por ID
#[utoipa::path(
    get,
    path = "/api/alumnos/{id}",
    params(
        ("id" = i32, Path, description = "ID del alumno")
    ),
    responses(
        (status = 200, description = "Alumno encontrado", body = AlumnoResponse),
        (status = 404, description = "Alumno no encontrado", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn get_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,  // Cambiado de String a i32
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    match sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
        .bind(id)  // Ya no necesita &id
        .fetch_optional(&pool)
        .await
    {
        Ok(Some(alumno)) => Ok(Json(AlumnoResponse {
            success: true,
            message: "Alumno encontrado".to_string(),
            data: Some(alumno),
        })),
        Ok(None) => Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                success: false,
                message: "Alumno no encontrado".to_string(),
                errors: None,
            }),
        )),
        Err(e) => {
            tracing::error!("Error al obtener alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// Crear un nuevo alumno
#[utoipa::path(
    post,
    path = "/api/alumnos",
    request_body = CreateAlumnoRequest,
    responses(
        (status = 201, description = "Alumno creado exitosamente", body = AlumnoResponse),
        (status = 400, description = "Datos inválidos", body = ErrorResponse),
        (status = 409, description = "Email ya existe", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn create_alumno(
    State(pool): State<Pool<MySql>>,
    Json(payload): Json<CreateAlumnoRequest>,
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Validar datos
    if let Err(errors) = payload.validate() {
        let error_messages: Vec<String> = errors
            .field_errors()
            .into_iter()
            .flat_map(|(_, v)| v.into_iter().map(|e| e.message.as_ref().unwrap().to_string()))
            .collect();

        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                success: false,
                message: "Datos de entrada inválidos".to_string(),
                errors: Some(error_messages),
            }),
        ));
    }

    let promedio = payload.promedio.unwrap_or(0.0);

    let query = r#"
        INSERT INTO alumnos (nombre, apellido, email, edad, carrera, semestre, promedio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    "#;

    match sqlx::query(query)
        .bind(&payload.nombre)
        .bind(&payload.apellido)
        .bind(&payload.email)
        .bind(payload.edad)
        .bind(&payload.carrera)
        .bind(payload.semestre)
        .bind(promedio)  
        .execute(&pool)
        .await
    {
        Ok(result) => {
            let alumno_id = result.last_insert_id() as i32;

            // Obtener el alumno creado
            match sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
                .bind(alumno_id)
                .fetch_one(&pool)
                .await
            {
                Ok(alumno) => Ok(Json(AlumnoResponse {
                    success: true,
                    message: "Alumno creado exitosamente".to_string(),
                    data: Some(alumno),
                })),
                Err(e) => {
                    tracing::error!("Error al obtener alumno creado: {}", e);
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ErrorResponse {
                            success: false,
                            message: "Error interno del servidor".to_string(),
                            errors: Some(vec![e.to_string()]),
                        }),
                    ))
                }
            }
        }
        Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
            Err((
                StatusCode::CONFLICT,
                Json(ErrorResponse {
                    success: false,
                    message: "El email ya existe".to_string(),
                    errors: None,
                }),
            ))
        }
        Err(e) => {
            tracing::error!("Error al crear alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// Actualizar un alumno
#[utoipa::path(
    put,
    path = "/api/alumnos/{id}",
    params(
        ("id" = i32, Path, description = "ID del alumno")
    ),
    request_body = UpdateAlumnoRequest,
    responses(
        (status = 200, description = "Alumno actualizado exitosamente", body = AlumnoResponse),
        (status = 400, description = "Datos inválidos", body = ErrorResponse),
        (status = 404, description = "Alumno no encontrado", body = ErrorResponse),
        (status = 409, description = "Email ya existe", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn update_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateAlumnoRequest>,
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Validar datos
    if let Err(errors) = payload.validate() {
        let error_messages: Vec<String> = errors
            .field_errors()
            .into_iter()
            .flat_map(|(_, v)| v.into_iter().map(|e| e.message.as_ref().unwrap().to_string()))
            .collect();

        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                success: false,
                message: "Datos de entrada inválidos".to_string(),
                errors: Some(error_messages),
            }),
        ));
    }

    // Verificar si el alumno existe
    let existing_alumno = sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await;

    match existing_alumno {
        Ok(Some(_)) => {}
        Ok(None) => {
            return Err((
                StatusCode::NOT_FOUND,
                Json(ErrorResponse {
                    success: false,
                    message: "Alumno no encontrado".to_string(),
                    errors: None,
                }),
            ))
        }
        Err(e) => {
            tracing::error!("Error al verificar alumno: {}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ));
        }
    }

    // Construir query de actualización dinámicamente con tipos correctos
    let mut query_builder = sqlx::QueryBuilder::new("UPDATE alumnos SET ");
    let mut has_updates = false;

    if let Some(nombre) = &payload.nombre {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("nombre = ").push_bind(nombre);
        has_updates = true;
    }
    
    if let Some(apellido) = &payload.apellido {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("apellido = ").push_bind(apellido);
        has_updates = true;
    }
    
    if let Some(email) = &payload.email {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("email = ").push_bind(email);
        has_updates = true;
    }
    
    if let Some(edad) = payload.edad {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("edad = ").push_bind(edad);
        has_updates = true;
    }
    
    if let Some(carrera) = &payload.carrera {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("carrera = ").push_bind(carrera);
        has_updates = true;
    }
    
    if let Some(semestre) = payload.semestre {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("semestre = ").push_bind(semestre);
        has_updates = true;
    }
    
    if let Some(promedio) = payload.promedio {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("promedio = ").push_bind(promedio);
        has_updates = true;
    }
    
    if let Some(activo) = payload.activo {
        if has_updates {
            query_builder.push(", ");
        }
        query_builder.push("activo = ").push_bind(activo); 
        has_updates = true;
    }

    if !has_updates {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                success: false,
                message: "No hay campos para actualizar".to_string(),
                errors: None,
            }),
        ));
    }

    query_builder.push(" WHERE id = ").push_bind(id);

    match query_builder.build().execute(&pool).await {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return Err((
                    StatusCode::NOT_FOUND,
                    Json(ErrorResponse {
                        success: false,
                        message: "Alumno no encontrado".to_string(),
                        errors: None,
                    }),
                ));
            }

            // Obtener el alumno actualizado
            match sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
                .bind(id)
                .fetch_one(&pool)
                .await
            {
                Ok(alumno) => Ok(Json(AlumnoResponse {
                    success: true,
                    message: "Alumno actualizado exitosamente".to_string(),
                    data: Some(alumno),
                })),
                Err(e) => {
                    tracing::error!("Error al obtener alumno actualizado: {}", e);
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ErrorResponse {
                            success: false,
                            message: "Error interno del servidor".to_string(),
                            errors: Some(vec![e.to_string()]),
                        }),
                    ))
                }
            }
        }
        Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
            Err((
                StatusCode::CONFLICT,
                Json(ErrorResponse {
                    success: false,
                    message: "El email ya existe".to_string(),
                    errors: None,
                }),
            ))
        }
        Err(e) => {
            tracing::error!("Error al actualizar alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}

/// Eliminar un alumno
#[utoipa::path(
    delete,
    path = "/api/alumnos/{id}",
    params(
        ("id" = i32, Path, description = "ID del alumno")
    ),
    responses(
        (status = 200, description = "Alumno eliminado exitosamente", body = AlumnoResponse),
        (status = 404, description = "Alumno no encontrado", body = ErrorResponse),
        (status = 500, description = "Error interno del servidor", body = ErrorResponse)
    ),
    tag = "Alumnos"
)]
pub async fn delete_alumno(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,  // Cambiado de String a i32
) -> Result<Json<AlumnoResponse>, (StatusCode, Json<ErrorResponse>)> {
    match sqlx::query("DELETE FROM alumnos WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
    {
        Ok(result) => {
            if result.rows_affected() == 0 {
                Err((
                    StatusCode::NOT_FOUND,
                    Json(ErrorResponse {
                        success: false,
                        message: "Alumno no encontrado".to_string(),
                        errors: None,
                    }),
                ))
            } else {
                Ok(Json(AlumnoResponse {
                    success: true,
                    message: "Alumno eliminado exitosamente".to_string(),
                    data: None,
                }))
            }
        }
        Err(e) => {
            tracing::error!("Error al eliminar alumno: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    success: false,
                    message: "Error interno del servidor".to_string(),
                    errors: Some(vec![e.to_string()]),
                }),
            ))
        }
    }
}