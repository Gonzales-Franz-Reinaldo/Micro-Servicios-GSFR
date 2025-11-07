# Ejemplo par a la bade de dato s

docker run -d \
  --name mongodb-vehiculos \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -e MONGO_INITDB_DATABASE=db_vehiculos \
  -v mongodb_vehiculos_data:/data/db \
  mongo:latest


# Instalar dependencias
cd microservicio-vehiculos
pip install -r requirements.txt

# Ejecutar
python -m uvicorn src.main:app --reload --port 8000