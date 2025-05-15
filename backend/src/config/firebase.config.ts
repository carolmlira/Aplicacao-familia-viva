import * as admin from 'firebase-admin';
import { join } from 'path';
import { existsSync } from 'fs';

const serviceAccountPath = join(__dirname, '..','..','src', 'config', 'familia-viva-recife-firebase-adminsdk-fbsvc-d7800a47bd.json');

if (!existsSync(serviceAccountPath)) {
  throw new Error(`Arquivo de credencial do Firebase não encontrado: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://familia-viva-recife-default-rtdb.firebaseio.com', // Realtime DB
  storageBucket: 'gs://familia-viva-recife.firebasestorage.app',
  
});

const firestore = admin.firestore();
const realtimeDB = admin.database();

export { admin, firestore, realtimeDB };