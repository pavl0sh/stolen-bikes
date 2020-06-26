import * as admin from 'firebase-admin';
import 'dotenv/config';

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENT_EMAIL,
        projectId: process.env.PROJECT_ID,
    }),
    databaseURL: process.env.FIRESTORE_DB,
});

const db: FirebaseFirestore.Firestore = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
