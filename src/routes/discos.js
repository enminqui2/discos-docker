import { Router } from 'express';
import mongoose from 'mongoose';
import Disco from '../models/Disco.js';

const router = Router();

const CAMPOS = ['grupo', 'nombre_disco', 'portada_disco'];

const MENSAJES = {
  creado: 'Disco añadido correctamente.',
  actualizado: 'Disco modificado correctamente.',
  eliminado: 'Disco eliminado correctamente.',
};

// Toma solo los campos permitidos del formulario
function datosFormulario(body) {
  return Object.fromEntries(CAMPOS.map((campo) => [campo, String(body[campo] ?? '').trim()]));
}

// Convierte un error de validación de Mongoose en { campo: mensaje }
function erroresValidacion(err) {
  if (!(err instanceof mongoose.Error.ValidationError)) throw err;
  return Object.fromEntries(Object.entries(err.errors).map(([campo, e]) => [campo, e.message]));
}

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Middleware: carga el disco de la URL o responde 404
async function cargarDisco(req, res, next) {
  const { id } = req.params;
  const disco = mongoose.isValidObjectId(id) ? await Disco.findById(id) : null;
  if (!disco) {
    return res.status(404).render('error.njk', {
      titulo: 'Disco no encontrado',
      mensaje: 'El disco que buscas no existe o ya se ha eliminado.',
    });
  }
  req.disco = disco;
  next();
}

// LISTADO ─ GET /discos  (admite ?q= para buscar)
router.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const filtro = q
    ? {
        $or: [
          { grupo: new RegExp(escaparRegex(q), 'i') },
          { nombre_disco: new RegExp(escaparRegex(q), 'i') },
        ],
      }
    : {};

  const discos = await Disco.find(filtro).sort({ grupo: 1, nombre_disco: 1 }).lean();

  res.render('discos/listado.njk', {
    titulo: 'Discos',
    discos,
    q,
    mensaje: MENSAJES[req.query.msg],
  });
});

// NUEVO ─ formulario
router.get('/nuevo', (req, res) => {
  res.render('discos/nuevo.njk', { titulo: 'Nuevo disco', disco: {}, errores: {} });
});

// NUEVO ─ guardar
router.post('/', async (req, res) => {
  const datos = datosFormulario(req.body);
  try {
    await Disco.create(datos);
    res.redirect('/discos?msg=creado');
  } catch (err) {
    res.status(400).render('discos/nuevo.njk', {
      titulo: 'Nuevo disco',
      disco: datos,
      errores: erroresValidacion(err),
    });
  }
});

// MODIFICAR ─ formulario
router.get('/:id/editar', cargarDisco, (req, res) => {
  res.render('discos/editar.njk', { titulo: 'Modificar disco', disco: req.disco, errores: {} });
});

// MODIFICAR ─ guardar
router.post('/:id/editar', cargarDisco, async (req, res) => {
  const datos = datosFormulario(req.body);
  try {
    req.disco.set(datos);
    await req.disco.save(); // save() aplica todas las validaciones del esquema
    res.redirect('/discos?msg=actualizado');
  } catch (err) {
    res.status(400).render('discos/editar.njk', {
      titulo: 'Modificar disco',
      disco: { ...datos, _id: req.disco._id },
      errores: erroresValidacion(err),
    });
  }
});

// ELIMINAR ─ confirmación
router.get('/:id/eliminar', cargarDisco, (req, res) => {
  res.render('discos/eliminar.njk', { titulo: 'Eliminar disco', disco: req.disco });
});

// ELIMINAR ─ borrar
router.post('/:id/eliminar', cargarDisco, async (req, res) => {
  await req.disco.deleteOne();
  res.redirect('/discos?msg=eliminado');
});

export default router;
