import Controller from '../interfaces/controller.interface';
import BikeService from '../services/bike.service';
import db from '../db';
import { Request, Response, NextFunction, Router } from 'express';

class BikeController implements Controller {
    public path = '/api/v1/bikes';
    public router = Router();
    private readonly bikeService: BikeService;

    constructor() {
        this.bikeService = new BikeService(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(this.path, this.getAllBikes);
    }

    private getAllBikes = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = await this.bikeService.getAllBikes();
            response.status(200).send(data);
            return data;
        } catch (e) {
            next(e);
        }
    };
}
