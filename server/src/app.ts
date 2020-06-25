import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';


import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';


class App {
    public expressApp: express.Application;

    constructor(controllers: Controller[]) {
        this.expressApp = express();

        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
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
        this.expressApp.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private initializeErrorHandling(): void {
        this.expressApp.use(errorMiddleware);
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
