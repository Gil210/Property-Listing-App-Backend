require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.get('/', (_req, res) => res.json({
  success: true,
  message: 'Property Listing API is running',
  docs: '/api-docs',
  endpoints: {
    'POST /api/v1/auth/register': 'Register a user or owner',
    'POST /api/v1/auth/login': 'Login to receive a JWT',
    'GET /api/v1/auth/me': 'Get the authenticated user',
    'GET /api/v1/properties': 'List all properties',
    'POST /api/v1/properties': 'Create a property (auth required)',
    'GET /api/v1/properties/:id': 'Get one property',
    'PUT /api/v1/properties/:id': 'Update a property (auth required)',
    'DELETE /api/v1/properties/:id': 'Delete a property (auth required)'
  }
}));
app.get('/health', (_req, res) => res.json({ success: true, message: 'API is healthy' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;