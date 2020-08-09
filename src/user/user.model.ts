import { model, Schema, Document } from 'mongoose';

interface Token {
    token: string;
    expires: Date;
};

export interface IUserSchema extends Document {
    name: string;
    email: string;
    password: string;
    active: boolean;
    role?: string;
    verification?: Token,
    passwordReset?: Token
};

const UserSchema: Schema = new Schema({
    name: { type: String, required: true, min: 3, max: 225 },
    email: { type: String, required: true, min: 6, max: 225 },
    password: { type: String, required: true, max: 1024, min: 6 },
    active: { type: Boolean, default: false },
    role: { type: String, default: 'PLAYER' },
    verification: {
        type: { token: { type: String }, expires: { type: Date } }
    },
    passwordReset: {
        type: { token: { type: String }, expires: { type: Date } }
    }
},
    { timestamps: true }
);

export default model<IUserSchema>('User', UserSchema);