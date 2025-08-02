# **Formulario de Solicitud de Activos Digitales para Equipos de Marketing**

## Información del Repositorio
Este proyecto está alojado en [GitHub](https://github.com/tu-usuario/tu-repositorio). 

## **Descripción del Proyecto**
Este proyecto permite a los equipos de marketing visualizar una galería de activos digitales y enviar solicitudes para su uso. Los administradores pueden gestionar estas solicitudes a través de un panel de control dedicado, aprobándolas o rechazándolas según corresponda.

---

## **Objetivos del Proyecto**  ¿Qué metas técnicas o de experiencia de usuario se plantearon?
- Desarrollar una galería web ligera para activos digitales.
- Permitir a los usuarios enviar solicitudes con campos para tipo de activo, propósito y fecha límite.
- Proporcionar un panel de administración para revisar y actualizar estados de solicitudes.
- Mostrar indicadores de estado: `Pendiente`, `Aprobado`, `Rechazado`.
- Notificaciones en pantalla.
- Requerimientos : Galeria de se accesible formulario disponible el tema de marketing requeste dash borad solo para admin atutenciacion basica notifi visuales hostorial de solictudes filtro o busacdor en la galeria 
- no funcionesles interfax intuitiva responsisve carga rapida de galeria scalabilidad mas tipos de assets compliance (accesibilty) contraste y todo en su lugar informacion.


## **Tecnologías Utilizadas**

| Área        | Tecnología               |
|-------------|--------------------------|
| Frontend    | React + Tailwind CSS     |
| Backend     | Node.js + Express        |
| Diseño      | Figma                    |
| Base de datos | Archivos JSON          |



## **Configuración del Proyecto** ¿Qué dependencias se deben instalar?

instlar todas las dependencias con npm install/////////////////

### Backend


```bash
    cd backend
    $env:DEBUG='myapp:*'; npm start
```

### Frontend

```bash
    cd frontend
    npm run dev
```

### Dependecias Backend

    "dependencies": {
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "morgan": "~1.9.1",
    "nodemailer": "^7.0.5",
    "uuid": "^11.1.0"
  }

### Dependecias Frontend


## Prueba del sistema 

Acceso interactivo: http://localhost:3000/api-docs

## Endpoints de la API 

### Crear Nueva Solicitud
**POST /test/requests**

Cuerpo de la solicitud:

json
{
  "id": "b1adb1c4-d37e-4a40-9caa-9c74be99bb97",
  "requesterName": "Santiago",
  "requesterEmail": "ing.daniel@gmail.com",
  "purpose": "PROMOCION VERANO",
  "deadline": "2025-08-21",
  "items": ["video-video1.mp4", "audio-audio1.mp3"],
  "status": "Pending",
  "adminComments": "Aprobado",
  "createdAt": "2025-07-30T01:44:23.262Z",
  "updatedAt": "2025-07-30T23:51:19.624Z"
}

    Respuesta: 201 Created     Solicitud creada exitosamente
    Respuesta: 400 Bad Request Campos requeridos faltantes


### Obtener Todas las Solicitudes
**GET /test/requests**

    *Respuesta: 200 OK	   Lista de solicitudes*
    *Respuesta: 204 No Content No hay solicitudes registradas*

### Actualizar Estado de Solicitud
**PATCH /test/requests/:id**

Cuerpo de la solicitud:

json
{
  "status": "Approved",
  "adminComments": "Aprobado para campaña de agosto"
}

    *Respuesta: 200 OK  Solicitud actualizada*
    *Respuesta: 404 Not Found Solicitud no encontrada*

### Crear Cuenta de Administrador
**POST /admin/create**

Cuerpo de la solicitud:

json
{
  "email": "admin@example.com",
  "password": "secure123"
}

    *Respuesta: 201 Created     Usuario creado exitosamente*
    *Respuesta: 400 Bad Request Datos faltantes*
    *Respuesta: 409 Conflict    Correo ya registrado*


### Inicio de Sesión de Administrador
**POST /admin/login**

Cuerpo de la solicitud:

json
{
  "email": "admin@example.com",
  "password": "secure123"
}

    *Respuesta: 200 OK           login exitoso.*
    *Respuesta: 400 Bad Request  Datos faltantes*
    *Respuesta: 401 Unauthorized Credenciales incorrectas*



### Simulacion envio de correo con Mailtrap
**GET /test/requests/{id}/summary** 


*Respuesta:200 OK: Correo enviado correctamente.
*Respuesta:400     Bad Request: La solicitud aún no ha sido aprobada ni rechazada.
*Respuesta:404     Not Found: Solicitud no encontrada.
*Respuesta:500     Internal Server Error: Fallo al enviar el correo.

## Artefactos de Diseño

    Diagramas y flujos disponibles en Figma: [Figma](https://www.figma.com/file/tu-id-de-proyecto)

## Cronograma del Proyecto

    Planificación tipo Gantt en ClickUp: [ClickUp](https://app.clickup.com/t/tu-id-de-tarea)

## Problemas Conocidos y Mejoras Futuras

    Ninguna funcionalidad crítica pendiente actualmente.


## Instrucciones de instalación más completas:

Variables de entorno requeridas  



## Requisitos previos del sistema
    
    instalar node js

## Documentación adicional:

Estructura de archivos/proyecto  

├── **backend/**
│   ├── **routes/**                 # Rutas de la API con anotaciones Swagger
│   │   └── **test.js**             # Endpoints para solicitudes y administración
│   ├── **storage/**               # Módulos de almacenamiento en JSON
│   │   ├── **adminStorage.js**    # Gestión de usuarios administradores 
│   │   └── **fileStorage.js**      # Gestión de solicitudes 
│   ├── **app.js**                  # Configuración principal de Express
│   ├── **adminusers.json**         # Base de datos de administradores
│   ├── **requests.json**           # Base de datos de solicitudes
│   ├── **package.json**           # Configuración del proyecto y dependencias
│   └── **public/**                 # Archivos multimedia organizados en subcarpetas:
│       ├── **videos/**             # Archivos de video solicitables
│       ├── **audios/**             # Archivos de audio solicitables
│       └── **images/**             # Imágenes disponibles en la galería
├── **views/**                     # Vistas Jade 
├── **README.md**                  # Este archivo

