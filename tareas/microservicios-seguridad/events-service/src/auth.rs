use actix_web::{dev::ServiceRequest, Error as ActixError, HttpMessage};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use serde::Deserialize;

#[derive(Debug, Clone, serde::Serialize, Deserialize)]
pub struct Claims {
    pub id: String,
    pub role: String,
    pub exp: usize,
}

// Validador para HttpAuthentication::bearer(...)
pub async fn validator(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, (ActixError, ServiceRequest)> {
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev_secret".into());
    let token = credentials.token();

    tracing::debug!("🔐 Validando token...");

    let data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    );

    match data {
        Ok(tok) => {
            // guarda los claims para usarlos en las rutas
            req.extensions_mut().insert(tok.claims);
            Ok(req)
        }
        Err(_) => {
            let err = actix_web::error::ErrorUnauthorized("token inválido o ausente");
            Err((err, req))
        }
    }
}
