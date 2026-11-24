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

## Puesta en marcha

### 1. Docker (solo la primera vez)

```bash
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER   # para usar docker sin sudo
```

Después cierra la sesión y vuelve a entrar para que se aplique el grupo `docker`.

### 2. Configuración

```bash
cp .env.example .env
nano .env      # cambia la contraseña en MONGO_ROOT_PASSWORD y en MONGODB_URI
```

### 3. Arrancar MongoDB

```bash
docker compose up -d
docker compose ps        # espera a que aparezca "healthy"
```

### 4. Instalar dependencias y arrancar la aplicación

```bash
npm install
npm run dev              # se reinicia sola al guardar cambios
```

Abre <http://localhost:3000>.

## Comandos útiles

```bash
docker compose logs -f mongo                      # ver el log de MongoDB
docker compose down                               # parar (los datos se conservan)
docker compose down -v                            # parar Y BORRAR el volumen de datos
docker exec -it discos-mongo mongosh -u admin -p  # consola de MongoDB
```

Dentro de `mongosh`:

```js
use discos
db.discos.find()
```

## Problemas frecuentes

**"MongoDB cannot start: Linux kernel versions 6.19 and newer has a known incompatibility"**
MongoDB 8 no funciona con los kernels de Linux comprendidos entre la 6.19 y la 7.0.13. Esto también pasa dentro de Docker, porque el contenedor usa el kernel del sistema. Comprueba tu versión con `uname -r` y actualiza:
`sudo apt update && sudo apt full-upgrade` y reinicia. Si no puedes actualizar el kernel, cambia `image: mongo:8` por `image: mongo:7.0` en `docker-compose.yml`.

**La aplicación dice "No se pudo conectar a MongoDB"**
Comprueba que el contenedor está en marcha (`docker compose ps`) y que el usuario y la contraseña de `MONGODB_URI` coinciden con los de `MONGO_ROOT_USER` y `MONGO_ROOT_PASSWORD`.

**He cambiado la contraseña en `.env` y ya no conecta**
El usuario administrador solo se crea la primera vez, cuando el volumen está vacío. Para volver a crearlo, borra el volumen con `docker compose down -v` y arranca de nuevo. Ten en cuenta que así se pierden los datos.
