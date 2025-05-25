import * as admin from 'firebase-admin';
export declare class FirebaseService {
    private firestore;
    private storage;
    private bucket;
    private messaging;
    constructor();
    uploadFile(file: Express.Multer.File, filename: string): Promise<string>;
    getFileUrl(filename: string): Promise<string>;
    deleteFileByUrl(fileUrl: string): Promise<void>;
    deleteFile(filename: string): Promise<void>;
    deleteFolder(folderPath: string): Promise<void>;
    listFiles(prefix: string): Promise<string[]>;
    listFilesInCategory(category: string, subgrup: string): Promise<string[]>;
    getCollectionByPath(path: string): Promise<admin.firestore.QuerySnapshot<admin.firestore.DocumentData, admin.firestore.DocumentData>>;
    listFilesInPage(pageId: string, category: string): Promise<string[]>;
    getUserById(id: string): Promise<admin.firestore.DocumentData | null | undefined>;
    updateUserImage(id: string, photoURL: string, filename: string): Promise<void>;
}
