import IController from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import PoliceService from '../services/police.service';
import db from '../db';
import HttpException from '../util/http.exception';
import PoliceOfficer from '../models/policeOfficer.model';
import validationMiddleware from '../middleware/validation.middleware';

class PoliceController implements IController {
    public path = '/api/v1/police';
    public router = Router();
    private readonly policeService: PoliceService;

    constructor() {
        this.policeService = new PoliceService(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(this.path, this.getAllNotAssignedPoliceOfficers);
        this.router.get(`${this.path}/:id`, this.getPoliceOfficerById);
        this.router.post(this.path, validationMiddleware(PoliceOfficer), this.createPoliceOfficer);
        this.router.patch(`${this.path}/:id`, validationMiddleware(PoliceOfficer, true), this.updatePoliceOfficerById);
        this.router.delete(`${this.path}/:id`, this.deletePoliceOfficerById);
        this.router.patch(`${this.path}/:officerId/bikes/:bikeId`, this.resolveBikeCase);
    }

    public getAllNotAssignedPoliceOfficers = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const result = await this.policeService.getAllNotAssignedPoliceOfficers();
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };

    public createPoliceOfficer = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const policeOfficer: PoliceOfficer = request.body;
            const createdOfficer = await this.policeService.createPoliceOfficer(policeOfficer);
            response.status(200).send(createdOfficer);
        } catch (e) {
            next(e);
        }
    };

    public updatePoliceOfficerById = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            if (request.body == null) {
                next(new HttpException(400, 'The body was empty or undefined'));
            }
            if (request.params.id == null) {
                next(new HttpException(400, 'The id is undefined'));
            }
            const result = await this.policeService.updatePoliceOfficer(request.params.id, request.body);
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };

    public deletePoliceOfficerById = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            if (request.params.id == null) {
                next(new HttpException(400, 'The id is undefined'));
            }
            const result = await this.policeService.deletePoliceOfficer(request.params.id);
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };

    public resolveBikeCase = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            if (request.params.bikeId == null) {
                next(new HttpException(400, 'The bike id is undefined'));
            }
            if (request.params.officerId == null) {
                next(new HttpException(400, 'The officer id is undefined'));
            }
            const result = await this.policeService.resolveBikeCase(request.params.bikeId, request.params.officerId);
            response.status(200).send(result);
        } catch (e) {
            next(e);
        }
    };

    public getPoliceOfficerById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            if (request.params.id == null) {
                next(new HttpException(400, 'The id is undefined'));
            }
            const officer = await this.policeService.getPoliceOfficerById(request.params.id);
            response.status(200).send(officer);
        } catch (e) {
            next(e);
        }
    };
}

export default PoliceController;
