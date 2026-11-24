# 1. Imagen base: Linux Alpine con Node.js 26 ya instalado
FROM node:26-alpine
LABEL org.opencontainers.image.source=https://github.com/enminqui2/discos-docker

# 2. Carpeta de trabajo dentro de la imagen
WORKDIR /app

# 3. Primero solo los archivos de dependencias, e instalarlas
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 4. Después, el resto del código
COPY . .

# 5. Ejecutar con un usuario sin privilegios (no root)
USER node

# 6. Documentar el puerto en el que escucha la app
EXPOSE 3000

# 7. Comando que se ejecuta al arrancar el contenedor
CMD ["node", "app.js"]
