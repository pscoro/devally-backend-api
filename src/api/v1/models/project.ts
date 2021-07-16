import mongoose, { Schema } from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import user from '../models/user';
import { Image } from './image';

class Position {
    @prop({ required: true })
    public title: string;

    @prop({ required: true })
    public isFilled: boolean;

    @prop()
    public user: Ref<typeof user>;

    @prop({ required: true })
    public description: string;
}

class Project {
    @prop({ required: true })
    public user: Ref<typeof user>;

    @prop({ required: true, default: [], type: Image })
    public images: mongoose.Types.Array<Image>;

    @prop({ required: true })
    public title: string;

    @prop({ required: true })
    public description: string;

    @prop({ required: true, default: [], type: String })
    public tags: mongoose.Types.Array<string>;

    @prop({ required: true, default: [], type: Position })
    public positions: mongoose.Types.Array<Position>;
}

const project = getModelForClass(Project, { schemaOptions: { timestamps: true, strict: true } });
project.createIndexes();

export default project;
