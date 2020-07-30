import { Request, Response, NextFunction } from 'express';
import CustomError from '../_helpers/custom-error';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message, details: err.details });
};

export default errorHandler;