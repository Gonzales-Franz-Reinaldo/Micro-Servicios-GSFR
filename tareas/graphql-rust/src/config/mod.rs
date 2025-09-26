use sqlx::{MySql, Pool};
use dotenvy::dotenv;
use std::env;

pub async fn db_pool() -> Pool<MySql> {
    dotenv().ok();
    let url = env::var("DATABASE_URL").expect("DATABASE_URL no encontrado");
    Pool::<MySql>::connect(&url)
        .await
        .expect("Error conectando a la base de datos")
}
