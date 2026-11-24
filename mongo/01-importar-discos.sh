#!/bin/bash
# Se ejecuta SOLO la primera vez que arranca el contenedor (volumen vacío).
# Importa discos.json en la colección "discos" de la base de datos "discos".
set -e

mongoimport \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --db discos --collection discos \
  --jsonArray --file /docker-entrypoint-initdb.d/discos.json
