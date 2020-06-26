import IPoliceOfficer from '../interfaces/policeOfficer.interface';
import { IsNotEmpty, IsString, IsAlpha, Length } from 'class-validator';

export default class PoliceOfficer implements IPoliceOfficer {
    @IsString()
    @IsAlpha()
    @Length(3, 50)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsAlpha()
    @Length(3, 50)
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    bikeId?: string;
}
