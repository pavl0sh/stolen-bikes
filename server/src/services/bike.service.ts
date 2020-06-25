import {
    CollectionReference,
    Firestore,
    DocumentReference,
    DocumentSnapshot,
    DocumentData,
} from '@google-cloud/firestore';
import HttpException from '../util/http.exception';
import BikeNotFoundException from '../util/bikeNotFound.exception';
import PoliceService from './police.service';
import db from '../db';

class BikeService {
    private readonly collection: CollectionReference;

    constructor(db: Firestore) {
        this.collection = db.collection('bikes');
    }

    public async getAllBikes(): Promise<DocumentData[]> {
        try {
            const listDocuments: DocumentReference[] = await this.collection.listDocuments();
            const documentSnapshots: Array<Promise<DocumentSnapshot>> = [];
            for (const document of listDocuments) {
                documentSnapshots.push(document.get());
            }
            const allPromises = await Promise.all(documentSnapshots);
            const data: DocumentData[] = [];
            for (const promise of allPromises) {
                data.push({ id: promise.id, data: promise.data() as DocumentData });
            }
            return data;
        } catch (e) {
            throw new HttpException(404, 'Bikes not found');
        }
    }

    public async getBikeById(id: string): Promise<DocumentData> {
        const ref: DocumentReference = this.collection.doc(id);
        const snap: DocumentSnapshot = await ref.get();
        if (!snap.exists) {
            throw new BikeNotFoundException(id);
        }
        return snap.data();
    }

    public async createBike(object: DocumentData): Promise<DocumentData> {
        const ref: DocumentReference = await this.collection.add(object);
        const snap: DocumentSnapshot = await ref.get();
        if (!snap.exists) {
            throw new HttpException(404, 'Could not create bike');
        }
        return snap.data();
    }

    public async updateBike(id: string, object: DocumentData): Promise<DocumentData> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            const snap: DocumentSnapshot = await ref.get();
            if (!snap.exists) {
                throw new BikeNotFoundException(id);
            }
            await ref.update(object);
            return (await ref.get()).data();
        } catch (e) {
            throw new HttpException(404, 'Could not update bike');
        }
    }

    public async deleteBike(id: string): Promise<string> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            await ref.delete();
            return `Bike with id ${id} succesfully deleted`;
        } catch (e) {
            throw new BikeNotFoundException(id);
        }
    }

    public async assignBikeToPolice(bikeId: string): Promise<[DocumentData, DocumentData] | HttpException> {
        try {
            const policeService = new PoliceService(db);
            const notAssignedOfficers = await policeService.getAllNotAssignedPoliceOfficers();
            if (notAssignedOfficers.length == 0) {
                throw new HttpException(404, 'No Available officers');
            }
            //auto assign of first officer in array
            const officerId = notAssignedOfficers[0].id;
            const updatedStatuses = await Promise.all([
                policeService.updatePoliceOfficer(officerId, {
                    status: 'Assigned',
                    bikeId: bikeId,
                }),
                this.updateBike(bikeId, { status: 'Assigned' }),
            ]);
            return updatedStatuses;
        } catch (e) {
            throw e;
        }
    }

    public async getAllNotAssignedBikes(): Promise<DocumentData[]> {
        try {
            const query = await this.collection.where('status', '==', 'Not Assigned').get();
            const documentData: DocumentData[] = [];
            query.forEach((doc) => {
                documentData.push({ id: doc.id, data: doc.data() });
            });
            return documentData;
        } catch (e) {
            throw new HttpException(404, 'Could not fetch bikes');
        }
    }
}

export default BikeService;
