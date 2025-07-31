const express = require('express');
const errores = require('http-errors');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const requestsrouter = require('./routes/test');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de la API',
      version: '1.0.0',
      description: 'Endpoints disponibles de la API',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/*.js'], // ← Aquí indicas donde están tus rutas con anotaciones Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                 
}));

// Logging y analizar
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));  
app.use(cookieParser());

// Montar router
app.use('/test', requestsrouter);

// Estáticos (si los usas)
app.use(express.static(path.join(__dirname, 'public')));
['imagenes', 'videos', 'audios'].forEach(carp => {
  app.use(`/${carp}`, express.static(`public/${carp}`));
});

// 404 + manejo de errores
app.use((req, res, next) => next(errores(404)));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});


module.exports = app;
