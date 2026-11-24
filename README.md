# Discos: aplicación Node.js + MongoDB con Docker

Aplicación web (Express + Nunjucks) que hace un CRUD de discos sobre MongoDB.
Las imágenes están publicadas en GitHub Container Registry:

- `ghcr.io/enminqui2/discos-app:1.0`: la aplicación
- `ghcr.io/enminqui2/discos-mongo:1.0`: MongoDB 7.0 con los datos iniciales

## Requisitos

Solo Docker (con Docker Compose). No hace falta instalar Node.js ni MongoDB.

## Puesta en marcha

```bash
git clone https://github.com/enminqui2/discos-docker.git
cd discos-docker
cp .env.example .env        # y edita .env para poner tu propia contraseña
docker compose pull         # descarga las imágenes desde ghcr.io
docker compose up -d        # arranca MongoDB y la aplicación
```

Abre http://localhost:3000

## Parar

```bash
docker compose down         # para y borra los contenedores (los datos se conservan)
docker compose down -v      # además BORRA los datos (vuelven los iniciales)
```

# Discoteca: CRUD de discos con Node.js, Nunjucks y MongoDB (Docker)

Una aplicación web con Express 5, Nunjucks y Mongoose. Usa una base de datos `discos` en MongoDB, que se ejecuta en un contenedor Docker con un volumen para guardar los datos.

## Estructura

```
discos-app/
├── app.js                    # Arranque de Express + Nunjucks
├── docker-compose.yml        # MongoDB 8 con volumen "discos_datos"
├── docker/mongo-init.js      # Datos de ejemplo (solo la primera vez)
├── .env.example              # Variables de entorno (cópialo como .env)
├── src/
│   ├── db.js                 # Conexión a MongoDB
│   ├── models/Disco.js       # Esquema: grupo, nombre_disco, portada_disco
│   └── routes/discos.js      # Rutas CRUD
├── views/
│   ├── layout.njk            # Plantilla base
│   ├── error.njk
│   └── discos/
│       ├── listado.njk       # Listado (con buscador)
│       ├── nuevo.njk         # Alta
│       ├── editar.njk        # Modificación
│       ├── eliminar.njk      # Confirmación de borrado
│       └── _formulario.njk   # Formulario compartido (macro)
└── public/css/estilos.css
```

## Rutas

| Método | Ruta                    | Qué hace                       |
|--------|-------------------------|--------------------------------|
| GET    | `/discos`               | Listado (`?q=` para buscar)    |
| GET    | `/discos/nuevo`         | Formulario de alta             |
| POST   | `/discos`               | Guarda un disco nuevo          |
| GET    | `/discos/:id/editar`    | Formulario de modificación     |
| POST   | `/discos/:id/editar`    | Guarda los cambios             |
| GET    | `/discos/:id/eliminar`  | Página de confirmación         |
| POST   | `/discos/:id/eliminar`  | Elimina el disco               |
