import * as admin from 'firebase-admin';
declare const firestore: admin.firestore.Firestore;
declare const realtimeDB: import("firebase-admin/lib/database/database").Database;
declare const storage: import("firebase-admin/lib/storage/storage").Storage;
export { admin, firestore, realtimeDB, storage };
