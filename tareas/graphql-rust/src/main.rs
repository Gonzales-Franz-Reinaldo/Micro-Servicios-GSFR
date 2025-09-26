mod config;
mod graphql;
mod domain;

use actix_web::{web, App, HttpServer, HttpResponse};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use async_graphql::http::GraphQLPlaygroundConfig; 
use crate::graphql::{create_schema, AppSchema};
use crate::config::db_pool;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // obtenemos el pool de la BD
    let pool = db_pool().await;

    // construimos el schema con la función centralizada
    let schema: AppSchema = create_schema(pool);

    println!("GraphQL en http://localhost:3000/graphql");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .service(
                web::resource("/graphql")
                    // POST → para queries GraphQL
                    .route(web::post().to(
                        |schema: web::Data<AppSchema>, req: GraphQLRequest| async move {
                            let response = schema.execute(req.into_inner()).await;
                            GraphQLResponse::from(response)
                        },
                    ))
                    // GET → para abrir el Playground en el navegador
                    .route(web::get().to(|| async {
                        HttpResponse::Ok()
                            .content_type("text/html; charset=utf-8")
                            .body(async_graphql::http::playground_source(
                                GraphQLPlaygroundConfig::new("/graphql"),
                            ))
                    })),
            )
    })
    .bind(("127.0.0.1", 3000))?
    .run()
    .await
}
