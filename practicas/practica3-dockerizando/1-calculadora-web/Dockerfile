FROM node:22-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

RUN mkdir -p public # Crear el directorio público

EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]