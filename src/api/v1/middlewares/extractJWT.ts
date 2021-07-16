import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import config from '../../../config/config';
import logging from '../../../config/logging';

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    logging.info(NAMESPACE, 'Validating Token');

    // const token = req.headers['x-access-token'] as string;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.accessSecret, (error, decoded) => {
            //decoded == user for users etc WOAH!
            if (error) {
                return res.status(403).json({
                    message: error,
                    error
                });
            } else {
                // res.locals.jwt = decoded;
                req.body.userEmail = (<any>decoded).email;
                console.log('HI');
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;
