const swaggerJSDoc = require('swagger-jsdoc');

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Web Api for ChecklistSL project',
            description: "This is a  Expressjs based Web Api for ChecklistSL application. Powered by Yandex.Translate (http://translate.yandex.com/)",
            contact: {
                "name": "Andrei Surzhan",
                "email": "surzhan.a.y@gmail.com"
            },
            version: '1.0.0'
        },
        basedPath: '/api',
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    bearerFormat: 'Bearer'
                }
            }
        }
    },
    // Path to the API docs
    apis: [
        `${__dirname}/routes/*.js`,
        `${__dirname}/models/*.js`
    ] 
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
module.exports = swaggerJSDoc(swaggerOptions);
