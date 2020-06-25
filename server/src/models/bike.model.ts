import IBike from '../interfaces/bike.interface';
import { IsNotEmpty, IsString, IsAlpha } from 'class-validator';

export default class Bike implements IBike {
    @IsString()
    @IsAlpha()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsAlpha()
    @IsNotEmpty()
    comments: string;

    @IsString()
    @IsAlpha()
    @IsNotEmpty()
    status: string;
}
