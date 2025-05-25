import { CreatePageDto } from './dto/create-page.dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto/update-page.dto';
import { admin } from '../config/firebase.config';
import { FirebaseService } from 'src/firebase/firebase.service';
export declare class PagesService {
    private readonly firebaseService;
    private collection;
    constructor(firebaseService: FirebaseService);
    create(createPageDto: CreatePageDto, category: string, images?: Express.Multer.File[]): Promise<any>;
    findAll(category: string): Promise<admin.firestore.DocumentData[]>;
    findAllProjects(): Promise<any[]>;
    findOne(id: string, category: string): Promise<admin.firestore.DocumentData | undefined>;
    update(id: string, updatePageDto: UpdatePageDto, category: string): Promise<{
        title?: string | undefined;
        content?: string | undefined;
        slug?: string | undefined;
        icon?: string | undefined;
        active?: boolean | undefined;
        images?: string[] | undefined;
        updatedBy?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    remove(id: string, category: string): Promise<{
        deleted: boolean;
    } | null>;
}
