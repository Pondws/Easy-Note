const Hapi = require('@hapi/hapi');
require("dotenv").config()
const { mongoose } = require('mongoose')
const jwt = require('@hapi/jwt');

//controller
const customerController = require("./controllers/customerController")
const categoryNoteController = require("./controllers/categoryNoteController")
const noteController = require("./controllers/noteController")
const historyNoteController = require("./controllers/historyNoteController")

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost',
        "routes": {
            "cors": true
        }
    });

    await server.register(jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400,
            timeSkewSec: 15
        },
        validate: (artifacts, request, h) => {
            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload }
            };
        }
    });

    server.auth.default('jwt');

    server.route([
        // customer
        {
            method: 'POST',
            path: '/customer/register',
            options: {
                auth: false
            },
            handler: customerController.registerCostomer
        },
        {
            method: 'POST',
            path: '/customer/login',
            options: {
                auth: false
            },
            handler: customerController.loginCustomer
        },
        {
            method: 'GET',
            path: '/note',
            options: {
                auth: 'jwt'
            },
            handler: (request, h) => {
                const user = request.auth.credentials.user;
                return h.response({ message: 'Authenticated', user }).code(200);
            }
        },

        // category
        {
            method: 'GET',
            path: '/categories',
            options: {
                auth: 'jwt'
            },
            handler: categoryNoteController.getCategories
        },
        {
            method: 'POST',
            path: '/categories',
            options: {
                auth: 'jwt'
            },
            handler: categoryNoteController.createCategory
        },
        {
            method: 'DELETE',
            path: '/categories/{id}',
            options: {
                auth: 'jwt'
            },
            handler: categoryNoteController.deleteCategory
        },
        {
            method: 'PUT',
            path: '/categories/{id}',
            options: {
                auth: 'jwt'
            },
            handler: categoryNoteController.updateCategory
        },

        // note
        {
            method: 'POST',
            path: '/note',
            options: {
                auth: 'jwt'
            },
            handler: noteController.createNote
        },
        {
            method: 'GET',
            path: '/notes',
            options: {
                auth: 'jwt'
            },
            handler: noteController.getAllNotes
        },
        {
            method: 'DELETE',
            path: '/note/{id}',
            options: {
                auth: 'jwt'
            },
            handler: noteController.deleteNote
        },
        {
            method: 'PUT',
            path: '/note/{id}',
            options: {
                auth: 'jwt'
            },
            handler: noteController.updateNote
        },
        {
            method: 'GET',
            path: '/note/{categoryId}',
            options: {
                auth: 'jwt'
            },
            handler: noteController.getNotesByCategoriesId
        },

        // history
        {
            method: 'POST',
            path: '/history',
            options: {
                auth: 'jwt'
            },
            handler: historyNoteController.createHistory
        }
    ]);

    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log('Connected to the database');
        })
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.log('Failed to connect to the database', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();