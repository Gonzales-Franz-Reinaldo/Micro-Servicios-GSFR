use async_graphql::{Context, Object};
use sqlx::MySqlPool;
use crate::domain::alumno::Alumno;
use chrono::Utc;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    // Crear alumno
    async fn crear_alumno(
        &self,
        ctx: &Context<'_>,
        nombre: String,
        apellido: String,
        email: String,
        edad: i32,
        carrera: String,
        semestre: i32,
        promedio: f64,
    ) -> async_graphql::Result<Alumno> {
        let pool = ctx.data::<MySqlPool>()?;
        let now = Utc::now().naive_utc(); 

        // INSERT
        let result = sqlx::query(
            r#"
            INSERT INTO alumnos 
            (nombre, apellido, email, edad, carrera, semestre, promedio, activo, fecha_registro, fecha_actualizacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            "#
        )
        .bind(&nombre)
        .bind(&apellido)
        .bind(&email)
        .bind(edad)
        .bind(&carrera)
        .bind(semestre)
        .bind(promedio)
        .bind(now)
        .bind(now)
        .execute(pool)
        .await?;

        // obtener el id insertado
        let last_id = result.last_insert_id();

        // SELECT del alumno recién creado
        let alumno = sqlx::query_as::<_, Alumno>(
            "SELECT * FROM alumnos WHERE id = ?"
        )
        .bind(last_id)
        .fetch_one(pool)
        .await?;

        Ok(alumno)
    }

    // Editar alumno
    async fn editar_alumno(
        &self,
        ctx: &Context<'_>,
        id: i32,
        nombre: Option<String>,
        apellido: Option<String>,
        email: Option<String>,
        edad: Option<i32>,
        carrera: Option<String>,
        semestre: Option<i32>,
        promedio: Option<f64>,
        activo: Option<bool>,
    ) -> async_graphql::Result<Option<Alumno>> {
        let pool = ctx.data::<MySqlPool>()?;
        let now = Utc::now().naive_utc();

        sqlx::query(
            r#"
            UPDATE alumnos
            SET nombre = COALESCE(?, nombre),
                apellido = COALESCE(?, apellido),
                email = COALESCE(?, email),
                edad = COALESCE(?, edad),
                carrera = COALESCE(?, carrera),
                semestre = COALESCE(?, semestre),
                promedio = COALESCE(?, promedio),
                activo = COALESCE(?, activo),
                fecha_actualizacion = ?
            WHERE id = ?
            "#
        )
        .bind(nombre)
        .bind(apellido)
        .bind(email)
        .bind(edad)
        .bind(carrera)
        .bind(semestre)
        .bind(promedio)
        .bind(activo)
        .bind(now)
        .bind(id)
        .execute(pool)
        .await?;

        let alumno = sqlx::query_as::<_, Alumno>(
            "SELECT * FROM alumnos WHERE id = ?"
        )
        .bind(id)
        .fetch_optional(pool)
        .await?;

        Ok(alumno)
    }

    // Eliminar alumno
    async fn eliminar_alumno(
        &self,
        ctx: &Context<'_>,
        id: i32,
    ) -> async_graphql::Result<bool> {
        let pool = ctx.data::<MySqlPool>()?;

        let rows = sqlx::query("DELETE FROM alumnos WHERE id = ?")
            .bind(id)
            .execute(pool)
            .await?
            .rows_affected();

        Ok(rows > 0)
    }
}
