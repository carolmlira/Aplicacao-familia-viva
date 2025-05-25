import { FirebaseService } from 'src/firebase/firebase.service';
export declare class SobreService {
    private readonly firebaseService;
    private sobre;
    private collection;
    constructor(firebaseService: FirebaseService);
    create(data: any, images?: Express.Multer.File[]): Promise<any>;
    update(id: string, data: any, images?: Express.Multer.File[]): Promise<any>;
    findAll(): Promise<{
        id: string;
    }[]>;
    remove(id: string): Promise<{
        deleted: boolean;
    } | null>;
}
