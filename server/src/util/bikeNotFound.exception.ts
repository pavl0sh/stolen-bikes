import HttpException from './http.exception';

class BikeNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Bike with id ${id} not found`);
    }
}

export default BikeNotFoundException;
