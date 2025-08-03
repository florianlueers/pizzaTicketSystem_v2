import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pizza Tracker API',
      version: '1.0.0',
    },
  },
  apis: ['./pages/api/*.js'], // Hier nach Bedarf anpassen
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
