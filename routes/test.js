const express = require('express');
const { v4: uuidv4 } = require('uuid');
const storage = require('../storage/fileStorage');
const adminUsers = require('../storage/adminStorage');
const sendCorreo = require('../utilidades/sendcorreos');



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
 *     tags: [Administración]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
router.get('/requests', (req, res) => {
  const allRequests = storage.getAll();
  if (!allRequests || allRequests.length === 0) {
    return res.status(204).send(); // No Content
  }
  return res.status(200).json(allRequests);
});

/**
 * @swagger
 * /test/requests/{id}:
 *   patch:
 *     summary: Actualizar estado o comentarios de una solicitud
 *     tags: [Administración]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *                 example: Approved
 *               adminComments:
 *                 type: string
 *                 example: Aprobado para campaña de agosto
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
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: secure123
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos faltantes o formato de correo inválido
 *       409:
 *         description: Correo ya registrado
 */

router.post('/admin/create', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  // Validación de formato de correo
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de correo inválido' });
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

/**
 * @swagger
 * /test/requests/{id}/summary:
 *   get:
 *     summary: Envía un correo con el resumen de una solicitud aprobada o rechazada
 *     description: Genera y envía un correo de confirmación al solicitante con los archivos aprobados o una notificación de rechazo. Solo funciona si la solicitud ya fue aprobada o rechazada.
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Correo enviado correctamente
 *       404:
 *         description: Solicitud no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Solicitud no encontrada
 *       400:
 *         description: La solicitud aún no ha sido aprobada ni rechazada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La solicitud aún no ha sido aprobada ni rechazada
 *       500:
 *         description: Error al enviar el correo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se pudo enviar el correo
 */


router.get('/requests/:id/summary', async (req, res) => {
  const id = req.params.id;
  const solicitud = storage.get(id);

  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }

  if (!['Approved', 'Rejected'].includes(solicitud.status)) {
    return res.status(400).json({ error: 'La solicitud aún no ha sido aprobada ni rechazada' });
  }

  const mensaje =
    solicitud.status === 'Approved'
      ? `Hola ${solicitud.requesterName},\n\nTu solicitud ha sido aprobada. A continuación se listan los archivos que puedes utilizar:\n\n${solicitud.items.map(i => `- ${i}`).join('\n')}\n\nGracias por tu solicitud.`
      : `Hola ${solicitud.requesterName},\n\nTu solicitud ha sido rechazada. Por favor revisa los requisitos y vuelve a enviarla si lo consideras necesario.\n\nGracias por tu interés.`;

  const resultado = await sendCorreo(solicitud.requesterEmail, `Resumen de tu solicitud #${solicitud.id}`, mensaje);


  if (resultado.success) {
    res.json({ success: true, message: 'Correo enviado correctamente' });
  } else {
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});
