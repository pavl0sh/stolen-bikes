import Controller from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import PoliceService from '../services/police.service';
import db from '../db';

class PoliceController implements Controller {
    public path = '/api/v1/police';
    public router = Router();
    private readonly policeService: PoliceService;

    constructor() {
        this.policeService = new PoliceService(db);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(this.path, this.getAllNotAssignedPoliceOfficers);
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
}

export default PoliceController;
