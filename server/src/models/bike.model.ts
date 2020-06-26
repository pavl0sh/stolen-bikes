import IBike from '../interfaces/bike.interface';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class Bike implements IBike {
    @IsString()
    @Length(4, 50)
    @IsNotEmpty()
    title: string;

    @IsString()
    @Length(4, 50)
    @IsNotEmpty()
    comments: string;

    @IsString()
    @IsNotEmpty()
    status: string;
}
