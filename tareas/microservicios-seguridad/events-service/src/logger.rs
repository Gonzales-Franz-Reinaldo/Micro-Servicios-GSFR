use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

pub fn init_logger() {
    tracing_subscriber::registry()
        .with(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "events_service=debug,actix_web=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
}