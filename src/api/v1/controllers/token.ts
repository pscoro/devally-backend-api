import { NextFunction, Request, Response } from 'express';
import logging from '../../../config/logging';
import config from './../../../config/config';
import jwt from 'jsonwebtoken';
import signJWT from './../functions/signJWT';
import User from '../models/user';
import { Session } from '../shared/types';

let NAMESPACE = 'TOKEN';

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    console.log('HI', req.cookies);
    let refreshToken = req.cookies.refresh_token as string;
    if (!refreshToken) {
        logging.error(NAMESPACE, 'No refresh token provided');
        return res.status(401).json({
            err: 'No refresh token provided'
        });
    }
    jwt.verify(refreshToken, config.server.token.refreshSecret, (err, decoded) => {
        if (err || !decoded) {
            logging.error(NAMESPACE, 'Invalid or expired refresh token');
            return res.status(401).json({
                err: 'Invalid or expired refresh token'
            });
        }
        // const newRefreshToken = jwt.sign(
        //     {
        //         email: decoded.email,
        //         username: decoded.username
        //     },
        //     config.server.token.refreshSecret,
        //     { expiresIn: config.server.token.refreshExpireTime }
        // );
        User.find({ email: (<any>decoded).email }, (err, doc) => {
            if (err) {
                logging.error(NAMESPACE, 'Error retreiving user data.');
                return res.status(500).send(err);
            }
            if (!doc || !doc[0] || !doc[0].tokens) {
                logging.error(NAMESPACE, 'No user or user tokens found.');
                return res.status(500).send('No user or user tokens found');
            }
            console.log('HEAHHA', doc[0].tokens[doc[0].tokens.length - 1].value);
            if (doc[0].tokens[doc[0].tokens.length - 1].value === refreshToken) {
                signJWT({ email: (<any>decoded).email, username: (<any>decoded).username }, (err, token) => {
                    const session: Session = {
                        access_token: token,
                        access_expires_in: config.server.token.accessExpireTime,
                        user: {
                            email: (<any>decoded).email,
                            username: (<any>decoded).username
                        }
                    };

                    // res.cookie('refresh_token', refreshToken, { httpOnly: true }); //dont send new refresh token i dont think
                    session.refresh_token = refreshToken;
                    return res.status(200).set('Access-Control-Allow-Origin', 'http://localhost:3000').send(session);
                });
            } else {
                console.log('HERE YE');
            }
        });
    });
};

export default { refreshToken };
