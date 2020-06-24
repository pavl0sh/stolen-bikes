import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import Controller from './interfaces/controller.interface';

class App {
    public expressApp: express.Application;

    constructor(controllers: Controller[]) {
        this.expressApp = express();

        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }

    private initializeMiddleware(): void {
        this.expressApp.use(cors());
        this.expressApp.use(bodyParser.json({ limit: '1mb' }));
        this.expressApp.use(
            bodyParser.urlencoded({
                limit: '1mb',
                extended: true,
                parameterLimit: 1000,
            }),
        );
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.expressApp.use('/', controller.router);
        });
    }

    public listen(): void {
        this.expressApp.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App;
