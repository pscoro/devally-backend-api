import mongoose, { Schema } from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { Image } from './image';
// import IUser from '../interfaces/user';

// const UserSchema: Schema = new Schema(
//     {
//         _id: Schema.Types.ObjectId,
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             index: true,
//             match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
//         },
//         username: {
//             type: String,
//             required: true,
//             index: true,
//             unique: true
//         },
//         password: {
//             type: String,
//             required: true
//         },

//         fullname: { type: String },
//         website: { type: String },
//         picture: { type: String }
//     },
//     {
//         timestamps: true,
//         strict: true
//     }
// );

class Token {
    @prop({ required: true })
    public value: string;

    @prop({ required: true })
    public issuedAt: Date;
} // ADD TOKEN CLASS HERE IF NEED BE

class User {
    @prop({ required: true })
    public email: string;

    @prop({ required: true })
    public username: string;

    @prop({ required: true })
    public password: string;

    @prop()
    public fullName?: string;

    @prop()
    public website?: string;

    @prop()
    public profilePicture?: Image;

    @prop({ default: [], type: () => Token })
    public tokens?: Token[];
}

// const user = mongoose.model<IUser>('User', UserSchema);
const user = getModelForClass(User, { schemaOptions: { timestamps: true, strict: true } });
user.createIndexes();

export default user;
