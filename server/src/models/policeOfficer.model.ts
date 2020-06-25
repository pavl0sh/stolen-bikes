import IPoliceOfficer from '../interfaces/policeOfficer.interface';
import { IsNotEmpty, IsString, IsAlpha } from 'class-validator';

export default class PoliceOfficer implements IPoliceOfficer {
    @IsString()
    @IsAlpha()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsAlpha()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsAlpha()
    @IsNotEmpty()
    status: string;

    @IsString()
    bikeId?: string;
}
