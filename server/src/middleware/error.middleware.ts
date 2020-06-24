import { NextFunction, Request, Response } from 'express';
import HttpException from '../util/http.exception';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction): void {
    const status = error.status || 500;
    const message = error.message || 'Oops! Something went wrong';
    response.status(status).send({ status, message });
}

export default errorMiddleware;
