import * as admin from 'firebase-admin';
import { join } from 'path';

const serviceAccount = require(join(__dirname, '..', 'config', 'familia-viva-recife-firebase-adminsdk-fbsvc-d7800a47bd.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://familia-viva-recife-default-rtdb.firebaseio.com' // Realtime DB
});

const firestore = admin.firestore();
const realtimeDB = admin.database(); 

export { admin, firestore, realtimeDB };
