import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

import logging from '../../../config/logging';
import User from '../models/user';
import signJWT from '../functions/signJWT';

const NAMESPACE = 'Users';

// const createUser = (req: Request, res: Response, next: NextFunction) => {
//     let { email, username, password } = req.body;

//     const user = new User({
//         _id: new mongoose.Types.ObjectId(),
//         email,
//         username,
//         password
//     });

//     return user
//         .save()
//         .then((result) => {
//             return res.status(201).json({
//                 user: result
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Authorized'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { email, username, password } = req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            username,
            password: hash
        });

        return _user
            .save()
            .then((result) => {
                return res.status(201).json({
                    user: result
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    let { usernameOrEmail, password } = req.body;

    // console.log(req);

    User.find({ username: usernameOrEmail })
        .exec()
        .then((users) => {
            if (users.length === 0) {
                User.find({ email: usernameOrEmail })
                    .exec()
                    .then((users) => {
                        if (users.length !== 1) {
                            return res.status(401).json({
                                message: 'Unauthorized'
                            });
                        }

                        bcryptjs.compare(password, users[0].password, (error, result) => {
                            if (error) {
                                return res.status(401).json({
                                    message: 'Password Mismatch'
                                });
                            } else if (result) {
                                signJWT(users[0], (_error, token) => {
                                    if (_error) {
                                        return res.status(500).json({
                                            message: _error.message,
                                            error: _error
                                        });
                                    } else if (token) {
                                        return res.status(200).json({
                                            message: 'Auth successful',
                                            token: token,
                                            user: users[0]
                                        });
                                    }
                                });
                            }
                        });
                    });
            } else if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            } else {
                bcryptjs.compare(password, users[0].password, (error, result) => {
                    if (error) {
                        return res.status(401).json({
                            message: 'Password Mismatch'
                        });
                    } else if (result) {
                        signJWT(users[0], (_error, token) => {
                            if (_error) {
                                return res.status(500).json({
                                    message: _error.message,
                                    error: _error
                                });
                            } else if (token) {
                                return res.status(200).json({
                                    message: 'Auth successful',
                                    token: token,
                                    user: users[0]
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
