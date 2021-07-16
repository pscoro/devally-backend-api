import http from 'http';
import express from 'express';
var cookieParser = require('cookie-parser');
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './api/v1/routes/user';
import tokenRoutes from './api/v1/routes/token';
import projectRoutes from './api/v1/routes/project';

const NAMESPACE = 'Server';

const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

/** Set up middleware */

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(
    cors({
        origin: 'https://localhost:3000',
        credentials: true
    })
);

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://localhost:3000'); // change later
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes go here */
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/token', tokenRoutes);
router.use('/api/v1/projects', projectRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
