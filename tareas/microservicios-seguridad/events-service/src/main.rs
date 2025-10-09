mod auth;
mod db;
mod errors;
mod logger;
mod models;
mod routes;

use actix_web::{middleware::Logger, web, App, HttpServer};
use actix_web_httpauth::middleware::HttpAuthentication;
use dotenvy::dotenv;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    
    // Inicializar logger
    logger::init_logger();
    
    tracing::info!("🚀 Iniciando Servicio de Eventos...");

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL no configurada");
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "3001".into())
        .parse()
        .unwrap_or(3001);

    let pool = db::init_db(&db_url).await;
    tracing::info!("✅ Conectado a MySQL exitosamente");

    // Middleware de autenticación
    let auth_mw = HttpAuthentication::bearer(auth::validator);

    tracing::info!("🌐 Servicio de eventos escuchando en http://127.0.0.1:{}", port);
    
    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(web::Data::new(pool.clone()))
            
            // RUTAS PÚBLICAS
            .service(routes::home)
            .service(routes::listar_eventos)
            .service(routes::obtener_evento)
            
            // RUTAS PROTEGIDAS (ADMIN)
            .service(
                web::scope("")
                    .wrap(auth_mw.clone())
                    .service(routes::crear_evento)
                    .service(routes::actualizar_evento)
                    .service(routes::eliminar_evento)
            )
            
            // 404 Handler
            .default_service(web::to(|| async {
                actix_web::HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Ruta no encontrada",
                    "status": 404
                }))
            }))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
