import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
        username: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },

        tokens: Array,

        fullname: { type: String },
        website: { type: String },
        picture: { type: String }
    },
    {
        timestamps: true,
        strict: true
    }
);

const user = mongoose.model<IUser>('User', UserSchema);
user.createIndexes();

export default user;
