import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto/update-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    create(category: string, images: Express.Multer.File[], createPageDto: CreatePageDto): Promise<any>;
    findAll(category: string): Promise<{
        pages: FirebaseFirestore.DocumentData[];
    }>;
    findOne(category: string, id: string): Promise<FirebaseFirestore.DocumentData | undefined>;
    findProjects(): Promise<any[]>;
    update(category: string, id: string, updatePageDto: UpdatePageDto): Promise<{
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
    remove(category: string, id: string): Promise<{
        deleted: boolean;
    } | null>;
}
