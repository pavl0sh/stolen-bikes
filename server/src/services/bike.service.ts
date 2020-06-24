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
                await documentSnapshots.push(document.get());
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
}

export default BikeService;
