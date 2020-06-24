import * as admin from 'firebase-admin';
import 'dotenv/config';
import serviceAccount from './service-account.json';

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
    }),
    databaseURL: process.env.FIRESTORE_DB,
});

const db: FirebaseFirestore.Firestore = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
