import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import logging from '../../../config/logging';
import User from '../models/user';
import signJWT from '../functions/signJWT';
import config from './../../../config/config';
import { Session } from './../shared/types';

const NAMESPACE = 'Users';

let refreshTokens = [];

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Authorized'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { email, username, password } = req.body;
    console.log(req.body);

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }

        User.create(
            {
                _id: new mongoose.Types.ObjectId(),
                email: email,
                username: username,
                password: hash
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                }
                if (!result) {
                    return res.status(500).json({
                        message: 'User not created'
                    });
                }
                return res.status(201).json({
                    user: result
                });
            }
        );

        // return _user
        //     .save()
        //     .then((result) => {
        //         return res.status(201).json({
        //             user: result
        //         });
        //     })
        //     .catch((error) => {
        //         return res.status(500).json({
        //             message: error.message,
        //             error
        //         });
        //     });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    const useCookie = typeof req.body.cookie !== 'undefined' ? req.body.cookie : true;
    console.log(req.body);
    let { usernameOrEmail, password } = req.body;

    // console.log(req);

    User.find({ username: usernameOrEmail })
        .exec()
        .then((usersByUsername) => {
            if (usersByUsername.length === 0) {
                User.find({ email: usernameOrEmail })
                    .exec()
                    .then((usersByEmail) => {
                        if (usersByEmail.length !== 1) {
                            return res.status(401).json({
                                message: 'Unauthorized'
                            });
                        }

                        bcryptjs.compare(password, usersByEmail[0].password, (error, result) => {
                            if (error) {
                                return res.status(401).json({
                                    message: 'Password Mismatch'
                                });
                            } else if (result) {
                                signJWT(usersByEmail[0], (_error, token) => {
                                    if (_error) {
                                        return res.status(500).json({
                                            message: _error.message,
                                            error: _error
                                        });
                                    } else if (token) {
                                        const refreshToken = jwt.sign(
                                            {
                                                email: usersByEmail[0].email,
                                                username: usersByEmail[0].username
                                            },
                                            config.server.token.refreshSecret,
                                            { expiresIn: config.server.token.refreshExpireTime }
                                        );
                                        // refreshTokens.push(refreshToken); //delete maybe

                                        let tokenDBObj = {
                                            value: refreshToken,
                                            issuedAt: Date.now()
                                        };
                                        User.findOneAndUpdate({ email: usernameOrEmail }, { $push: { tokens: { tokenDBObj } } }, { upsert: false }, (err, doc) => {
                                            if (err) {
                                                logging.error(NAMESPACE, 'Error updating refresh token in DB');
                                                return res.status(500).send(err);
                                            }
                                            const session: Session = {
                                                access_token: token,
                                                access_expires_in: config.server.token.accessExpireTime,
                                                user: {
                                                    email: usersByEmail[0].email,
                                                    username: usersByEmail[0].username
                                                }
                                            };

                                            if (useCookie) {
                                                console.log('HOW');
                                                res.cookie('refresh_token', refreshToken, { httpOnly: true });
                                                session.refresh_token = refreshToken;
                                            }
                                            return res.status(200).send(session);
                                        });
                                    }
                                });
                            }
                        });
                    });
            } else if (usersByUsername.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            } else {
                bcryptjs.compare(password, usersByUsername[0].password, (error, result) => {
                    if (error) {
                        return res.status(401).json({
                            message: 'Password Mismatch'
                        });
                    } else if (result) {
                        signJWT(usersByUsername[0], (_error, token) => {
                            if (_error) {
                                return res.status(500).json({
                                    message: _error.message,
                                    error: _error
                                });
                            } else if (token) {
                                const refreshToken = jwt.sign(
                                    {
                                        email: usersByUsername[0].email,
                                        username: usersByUsername[0].username
                                    },
                                    config.server.token.refreshSecret,
                                    { expiresIn: config.server.token.refreshExpireTime }
                                );

                                let tokenDBObj = {
                                    value: refreshToken,
                                    issuedAt: Date.now()
                                };
                                console.log(tokenDBObj);
                                User.findOneAndUpdate({ username: usernameOrEmail }, { $push: { tokens: tokenDBObj } }, { upsert: false }, (err, doc) => {
                                    if (err) {
                                        logging.error(NAMESPACE, 'Error updating refresh token in DB');
                                        return res.status(500).send(err);
                                    }
                                    const session: Session = {
                                        access_token: token,
                                        access_expires_in: config.server.token.accessExpireTime,
                                        user: {
                                            email: usersByUsername[0].email,
                                            username: usersByUsername[0].username
                                        }
                                    };

                                    if (useCookie) {
                                        console.log('USING COOKIE');
                                        res.cookie('refresh_token', refreshToken, { httpOnly: true, path: '/', domain: '127.0.0.1', sameSite: 'none', secure: true });
                                        session.refresh_token = refreshToken;
                                    }
                                    return res.status(200).send(session);
                                });
                            }
                        });
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

const logout = (req: Request, res: Response, next: NextFunction) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.sendStatus(204);
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { validateToken, register, login, getAllUsers };
