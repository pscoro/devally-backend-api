import { ReturnModelType } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import config from '../../../config/config';
import logging from '../../../config/logging';
import { UserData } from '../shared/types';

const NAMESPACE = 'Auth';

const signJWT = (user: UserData, callback: (error: Error | null, token: string | null) => void): void => {
    logging.info(NAMESPACE, `Attempting to sign token for ${user.username}`);

    try {
        jwt.sign(
            {
                email: user.email,
                username: user.username
            },
            config.server.token.accessSecret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: config.server.token.accessExpireTime
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default signJWT;
