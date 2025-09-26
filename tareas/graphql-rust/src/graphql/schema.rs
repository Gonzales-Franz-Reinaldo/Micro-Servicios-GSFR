use async_graphql::{Schema, EmptySubscription};
use crate::graphql::{QueryRoot, MutationRoot};
use sqlx::MySqlPool;

pub type AppSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub fn create_schema(pool: MySqlPool) -> AppSchema {
    Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool)
        .finish()
}
