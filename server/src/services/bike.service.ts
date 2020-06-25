import {
    CollectionReference,
    Firestore,
    DocumentReference,
    DocumentSnapshot,
    DocumentData,
} from '@google-cloud/firestore';
import HttpException from '../util/http.exception';

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

    public getBikeById(id: string): DocumentReference<DocumentData> {
        try {
            return this.collection.doc(id);
        } catch (e) {
            throw new HttpException(404, 'Bike not found');
        }
    }

    public async createBike(object: DocumentData): Promise<DocumentReference> {
        return await this.collection.add(object);
    }

    public async updateBike(id: string, object: DocumentData): Promise<DocumentReference> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            const snap: DocumentSnapshot = await ref.get();
            if (!snap.exists) {
                throw new HttpException(404, `Bike with id ${id} not found`);
            }
            await ref.update(object);
            return ref;
        } catch (e) {
            throw new HttpException(404, 'Could not update bike');
        }
    }

    public async deleteBike(id: string): Promise<DocumentReference> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            await ref.delete();
            return ref;
        } catch (e) {
            throw new HttpException(404, 'Bike not found');
        }
    }
}

export default BikeService;
