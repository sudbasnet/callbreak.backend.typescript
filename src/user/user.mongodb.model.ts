import { model, Schema, Document } from 'mongoose';
import { EUserRoles } from '../entities/enums/enums';
import { IUserSchema } from '../repositories/UserRepository';

const UserSchema: Schema = new Schema({
    name: { type: String, required: true, min: 3, max: 225 },
    email: { type: String, required: true, min: 6, max: 225 },
    password: { type: String, required: true, max: 1024, min: 6 },
    active: { type: Boolean, default: false },
    role: { type: String, default: EUserRoles.PLAYER },
    verification: {
        type: { token: { type: String }, expires: { type: Date } }
    },
    passwordReset: {
        type: { token: { type: String }, expires: { type: Date } }
    }
},
    { timestamps: true }
);

UserSchema.statics = {
    async findAllBots() {
        return await this.find({ role: 'bot' });
    }
};

export default model<IUserSchema>('User', UserSchema);
