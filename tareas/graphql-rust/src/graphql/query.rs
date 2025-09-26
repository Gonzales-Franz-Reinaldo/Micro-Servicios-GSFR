use async_graphql::{Context, Object};
use sqlx::MySqlPool;
use crate::domain::alumno::Alumno;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn alumnos(&self, ctx: &Context<'_>) -> async_graphql::Result<Vec<Alumno>> {
        let pool = ctx.data::<MySqlPool>()?;
        let alumnos = sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos")
            .fetch_all(pool)
            .await?;
        Ok(alumnos)
    }

    async fn alumno(&self, ctx: &Context<'_>, id: i32) -> async_graphql::Result<Option<Alumno>> {
        let pool = ctx.data::<MySqlPool>()?;
        let alumno = sqlx::query_as::<_, Alumno>("SELECT * FROM alumnos WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await?;
        Ok(alumno)
    }
}
