import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import config from './config.js';
import merchantRouter from './router/merchantRouter.js'; // Updated to import the correct router

dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;
const { sequelize } = config;

app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Merchant Side API',
      version: '1.0.0',
      description: 'API documentation for the merchant and payment processor',
      contact: {
        name: 'Aman Singh',
        email: 'amansinghdev200@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./router/*.js', './controllers/*.js'], // Adjusted path for Swagger docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/merchant', merchantRouter);

// Sync database and start the server
sequelize
  .authenticate()  // Optional but useful for ensuring DB connectivity before sync
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();  // Sync all models
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Payment processor API running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error.message);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
