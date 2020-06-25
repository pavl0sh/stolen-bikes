import {
    CollectionReference,
    Firestore,
    DocumentReference,
    DocumentSnapshot,
    DocumentData,
    QuerySnapshot,
} from '@google-cloud/firestore';
import HttpException from '../util/http.exception';
import PoliceOfficerNotFoundException from '../util/policeOfficerNotFound.exception';

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
        return snap.data();
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
            throw new HttpException(404, 'No police officers with status not assigned');
        }
    }
}

export default PoliceService;
