const express = require('express');
const { v4: uuidv4 } = require('uuid');
const storage = require('../storage/fileStorage');
const adminUsers = require('../storage/adminStorage');

const router = express.Router();

/**
 * @swagger
 * /test/requests:
 *   post:
 *     summary: Crear nueva solicitud
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requesterName
 *               - requesterEmail
 *               - purpose
 *               - deadline
 *               - items
 *             properties:
 *               requesterName:
 *                 type: string
 *               requesterEmail:
 *                 type: string
 *               purpose:
 *                 type: string
 *               deadline:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Solicitud creada
 *       400:
 *         description: Campos requeridos faltantes
 */
router.post('/requests', (req, res) => {
  const { requesterName, requesterEmail, purpose, deadline, items } = req.body;
  if (!requesterName || !requesterEmail || !purpose || !deadline || !items) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  const newRequest = {
    id: uuidv4(),
    requesterName,
    requesterEmail,
    purpose,
    deadline,
    items,
    status: 'Pending',
    adminComments: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storage.add(newRequest);
  return res.status(201).json(newRequest);
});

/**
 * @swagger
 * /test/requests:
 *   get:
 *     summary: Obtener todas las solicitudes
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
router.get('/requests', (req, res) => {
  return res.json(storage.getAll());
});

/**
 * @swagger
 * /test/requests/{id}:
 *   patch:
 *     summary: Actualizar estado o comentarios de una solicitud
 *     tags: [Solicitudes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *       404:
 *         description: Solicitud no encontrada
 */
router.patch('/requests/:id', (req, res) => {
  const actual = storage.update(req.params.id, req.body);
  if (!actual) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  return res.json(actual);
});

/**
 * @swagger
 * /test/admin/create:
 *   post:
 *     summary: Crear nuevo usuario administrador
 *     tags: [Administración]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos faltantes
 *       409:
 *         description: Correo ya registrado
 */
router.post('/admin/create', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  const existing = adminUsers.findByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'El correo ya está registrado' });
  }

  const newUser = {
    id: email,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  adminUsers.add(newUser);
  return res.status(201).json({ message: 'Usuario creado', user: newUser });
});

/**
 * @swagger
 * /test/admin/login:
 *   post:
 *     summary: Iniciar sesión como administrador
 *     tags: [Administración]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  const user = adminUsers.validateLogin(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
  }

  return res.status(200).json({ message: 'Login exitoso', user });
});

module.exports = router;
