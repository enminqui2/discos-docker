# MongoDB 7.0: la versión 8 no arranca con el kernel de Ubuntu 26.04 (7.0.x)
FROM mongo:7.0

# Los datos y el script de carga, en la carpeta que MongoDB ejecuta al inicializarse
COPY discos.json 01-importar-discos.sh /docker-entrypoint-initdb.d/
