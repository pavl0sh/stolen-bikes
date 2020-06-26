import {
    CollectionReference,
    Firestore,
    DocumentReference,
    DocumentSnapshot,
    DocumentData,
} from '@google-cloud/firestore';
import HttpException from '../util/http.exception';
import PoliceOfficerNotFoundException from '../util/policeOfficerNotFound.exception';
import BikeService from './bike.service';
import db from '../db';

class PoliceService {
    private readonly collection: CollectionReference;

    constructor(db: Firestore) {
        this.collection = db.collection('police');
    }

    public async createPoliceOfficer(object: DocumentData): Promise<DocumentData> {
        const ref: DocumentReference = await this.collection.add(object);
        const snap: DocumentSnapshot = await ref.get();
        if (!snap.exists) {
            throw new HttpException(404, 'Could not create police officer');
        }
        return { id: snap.id, data: snap.data() };
    }

    public async getPoliceOfficerById(id: string): Promise<DocumentData> {
        const ref: DocumentReference = this.collection.doc(id);
        const snap: DocumentSnapshot = await ref.get();
        if (!snap.exists) {
            throw new PoliceOfficerNotFoundException(id);
        }
        return snap.data();
    }

    public async updatePoliceOfficer(id: string, object: DocumentData): Promise<DocumentData> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            const snap: DocumentSnapshot = await ref.get();
            if (!snap.exists) {
                throw new PoliceOfficerNotFoundException(id);
            }
            await ref.update(object);
            return (await ref.get()).data();
        } catch (e) {
            throw new HttpException(404, 'Could not update police officer');
        }
    }

    public async getAllNotAssignedPoliceOfficers(): Promise<DocumentData[]> {
        try {
            const query = await this.collection.where('status', '==', 'Not Assigned').get();
            const documentData: DocumentData[] = [];
            query.forEach((doc) => {
                documentData.push({ id: doc.id, data: doc.data() });
            });
            return documentData;
        } catch (e) {
            throw new HttpException(404, 'Could not fetch police officers');
        }
    }

    public async deletePoliceOfficer(id: string): Promise<string> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            await ref.delete();
            return `Police officer with id ${id} successfully deleted`;
        } catch (e) {
            throw new PoliceOfficerNotFoundException(id);
        }
    }

    public async resolveBikeCase(
        bikeID: string,
        officerID: string,
    ): Promise<[DocumentData, DocumentData] | DocumentData | HttpException> {
        try {
            const bikeService = new BikeService(db);
            //set current officer not assigned
            await this.updatePoliceOfficer(officerID, { status: 'Not Assigned', bikeId: '' });
            const resolvedBikeCase = await bikeService.updateBike(bikeID, { status: 'Resolved' });
            //automatically find new not assigned bike case
            const notAssignedBikes = await bikeService.getAllNotAssignedBikes();
            if (notAssignedBikes.length > 0) {
                //assign first found not assigned bike case
                const assignedResult = await bikeService.assignBikeToPolice(notAssignedBikes[0].id);
                return assignedResult;
            }
            return resolvedBikeCase;
        } catch (e) {
            throw e;
        }
    }
}

export default PoliceService;
