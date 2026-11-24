import path from 'node:path';
import express from 'express';
import nunjucks from 'nunjucks';
import { conectarBD } from './src/db.js';
import discosRouter from './src/routes/discos.js';

const app = express();
const PORT = process.env.PORT ?? 3000;
const raiz = import.meta.dirname;

// Nunjucks como motor de plantillas (los archivos .njk están en /views)
nunjucks.configure(path.join(raiz, 'views'), {
  autoescape: true, // escapa HTML en {{ }} para evitar XSS
  express: app,
});
app.set('view engine', 'njk');

// Lee los datos de los formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));
// CSS y otros archivos estáticos
app.use(express.static(path.join(raiz, 'public')));

// Rutas
app.get('/', (req, res) => res.redirect('/discos'));
app.use('/discos', discosRouter);

// 404
app.use((req, res) => {
  res.status(404).render('error.njk', {
    titulo: 'Página no encontrada',
    mensaje: 'La página que buscas no existe.',
  });
});

// Errores no controlados (Express 5 recoge también los de funciones async)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error.njk', {
    titulo: 'Error',
    mensaje: 'Ha ocurrido un error inesperado. Revisa la consola del servidor.',
  });
});

await conectarBD(process.env.MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Aplicación disponible en http://localhost:${PORT}`);
});
