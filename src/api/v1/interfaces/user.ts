import { Document } from 'mongoose';

export interface IToken extends Document {
    kind: string;
    accessToken: string;
    tokenSecret?: string;
}

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;

    tokens?: IToken[];

    fullname?: string;
    website?: string;
    picture?: string;
}

export default IUser;
