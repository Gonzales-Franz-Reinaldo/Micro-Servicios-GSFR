use anyhow::Result;
use sqlx::{MySql, MySqlPool, Pool};

pub type DbPool = Pool<MySql>;

pub async fn create_connection_pool(database_url: &str) -> Result<DbPool> {
    let pool = MySqlPool::connect_with(
        database_url.parse()?,
    )
    .await?;

    // Verificar conexión
    let _connection = pool.acquire().await?;
    tracing::info!("✅ Conexión a MySQL establecida correctamente");

    Ok(pool)
}