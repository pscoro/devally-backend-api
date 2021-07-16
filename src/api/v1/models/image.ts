import { prop } from '@typegoose/typegoose';

export class Image {
    @prop()
    public name?: string;

    @prop()
    public alt?: string;

    @prop({ required: true })
    public data: Buffer;

    @prop({ required: true })
    public contentType: string;
}
