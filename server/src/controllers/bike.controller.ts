import Controller from '../interfaces/controller.interface';
import BikeService from '../services/bike.service';
import db from '../db';
import { Request, Response, NextFunction, Router } from 'express';
import Bike from '../interfaces/bike.interface';
import HttpException from '../util/http.exception';

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
        this.router.get(`${this.path}/:id`, this.getBikeById);
        this.router.post(this.path, this.createBike);
        this.router.patch(`${this.path}/:id`, this.updateBikeById);
        this.router.delete(`${this.path}/:id`, this.deleteBikeById);
    }

    public getAllBikes = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.bikeService.getAllBikes();
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };

    public createBike = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const bike: Bike = request.body;
            const createdBike = await this.bikeService.createBike(bike);
            response.status(200).send(createdBike);
        } catch (e) {
            next(e);
        }
    };

    public getBikeById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            if (request.params.id == null) {
                next(new HttpException(400, 'The id is undefined'));
            }
            const bike = await this.bikeService.getBikeById(request.params.id);
            response.status(200).send(bike);
        } catch (e) {
            next(e);
        }
    };

    public updateBikeById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            if (request.body == null) {
                next(new HttpException(400, 'The body was empty or undefined'));
            }
            if (request.params.id == null) {
                next(new HttpException(400, 'The id is undefined'));
            }
            const result = await this.bikeService.updateBike(request.params.id, request.body);
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };

    public deleteBikeById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            if (request.params.id == null) {
                next(new HttpException(400, 'The id is undefined'));
            }
            const result = await this.bikeService.deleteBike(request.params.id);
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };
}

export default BikeController;
