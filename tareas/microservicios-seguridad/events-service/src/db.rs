use sqlx::{mysql::MySqlPoolOptions, MySql, Pool};

pub type MyPool = Pool<MySql>;

pub async fn init_db(url: &str) -> MyPool {
    tracing::info!("Conectando a MySQL...");

    let pool = MySqlPoolOptions::new()
        .max_connections(10)
        .connect(url)
        .await
        .expect("❌ No se pudo conectar a MySQL. Verifica DATABASE_URL");

    tracing::info!("Verificando tabla 'eventos'...");

    // Solo crear la tabla si NO existe (sin eliminar datos)
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS eventos (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(255) NOT NULL,
          fecha DATETIME NOT NULL,
          lugar VARCHAR(255) NOT NULL,
          capacidad INT NOT NULL CHECK (capacidad > 0),
          precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
          creado_por VARCHAR(255) NULL COMMENT 'ID del usuario que creó el evento',
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_fecha (fecha),
          INDEX idx_creado_por (creado_por)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        "#,
    )
    .execute(&pool)
    .await
    .expect("❌ No se pudo crear/verificar la tabla eventos");

    tracing::info!("✅ Tabla 'eventos' verificada/creada correctamente");
    pool
}
