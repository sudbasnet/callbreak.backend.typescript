import { RequestHandler } from "express";
import sendgridEmail from '../../helpers/sendgrid-token-email';
import { UserRepository } from '../../repositories/UserRepository';
import CustomError from '../../entities/classes/CustomError';
import IEmailData from "../../entities/interfaces/IEmailData";
import { EEmailTokenType } from "../../entities/enums/enums";

// should be a get request ??
const requestPasswordReset: RequestHandler = async (req, res, next) => {
    const User = new UserRepository();
    const userEmail = req.params.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        throw new CustomError('User with that email does not exist', 404);
    }

    const userData: IEmailData = {
        sender: 'restapi201@gmail.com',
        tokenType: EEmailTokenType.PASSWORD_RESET,
        recipientId: String(user._id),
        subject: 'Cardgames - Password Reset',
        htmlBody: '<h1>To reset your password, please click on link below</h1>',
        link: `http://localhost:` + process.env.PORT + `/user/` + user._id + `/password_reset/`,
        linkText: 'Reset Password'
    };
    try {
        await sendgridEmail(userData);
        res.status(201).json({ message: 'You should receive an email to reset your password. </br> Please click on link provided.' })
    } catch (err) {
        next(err);
    }
};

export default requestPasswordReset;
