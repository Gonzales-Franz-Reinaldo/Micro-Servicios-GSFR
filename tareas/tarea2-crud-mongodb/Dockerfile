FROM node:22-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Crear directorio público si no existe
RUN mkdir -p public

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación en docker
CMD ["npm", "start"]