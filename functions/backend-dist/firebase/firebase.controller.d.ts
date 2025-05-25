import { FirebaseService } from './firebase.service';
export declare class FirebaseController {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    uploadMultipleFiles(files: Express.Multer.File[], category: string, pageId?: string): Promise<{
        url: string;
        filename: string;
    }[]>;
    uploadFile(file: Express.Multer.File, category: string, pageId?: string): Promise<{
        url: string;
        filename: string;
    }>;
    uploadSobreImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadLogoImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadUserImage(id: string, file: Express.Multer.File): Promise<{
        url: string;
    }>;
    getFile(filename: string): Promise<{
        url: string;
    }>;
    updateFile(file: Express.Multer.File, category: string, subgrup: string, filename: string, newName: string, pageId?: string): Promise<{
        url: string;
    }>;
    getLogoUrl(): Promise<{
        url: string;
    }>;
    getPagesByCategory(category: string): Promise<{
        pages: {
            id: string;
        }[];
    }>;
    deleteFileGeneric(category: string, subgrup: string, filename: string, pageId?: string): Promise<{
        message: string;
    }>;
    delete(filename: string): Promise<void>;
    deleteFolder(category: string, subgrup: string, pageId: string): Promise<{
        message: string;
    }>;
    listFiles(category: string): Promise<{
        files: string[];
    }>;
    getPageFilesByCategory(category: string, pageId: string): Promise<{
        files: string[];
    }>;
}
