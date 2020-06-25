import HttpException from './http.exception';

class PoliceOfficerNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Police officer with id ${id} not found`);
    }
}

export default PoliceOfficerNotFoundException;
