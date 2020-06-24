import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';

class ExampleController implements Controller {
    public path = '/api/v1/example';
    public router = Router();

    private examples = [
        {
            author: 'Marcin',
            content: 'Dolor sit amet',
            title: 'Lorem Ipsum',
        },
    ];

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(this.path, this.getAll);
    }

    private getAll = (request: Request, response: Response): void => {
        response.send(this.examples);
    };
}

export default ExampleController;
