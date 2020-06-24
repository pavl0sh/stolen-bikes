import { Timestamp } from '@google-cloud/firestore';

export default interface Bike {
    title: string;
    status: string;
    stolen: Timestamp;
}
