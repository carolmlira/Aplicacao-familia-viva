import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateBannerDto } from './dto/create-banner/create-banner';
import { UpdateBannerDto } from './dto/update-banner/update-banner';
export declare class BannerService {
    private readonly firebaseService;
    private collection;
    constructor(firebaseService: FirebaseService);
    create(files: {
        imagemLogo: Express.Multer.File;
        imagemBanner: Express.Multer.File;
    }, dto: CreateBannerDto): Promise<{
        frase: string | undefined;
        imagemLogo: string;
        imagemBanner: string;
        createdAt: Date;
        id: string;
    }>;
    findOne(): Promise<{
        id: string;
    }[]>;
    update(id: string, files: Partial<{
        imagemLogo: Express.Multer.File;
        imagemBanner: Express.Multer.File;
    }>, dto: UpdateBannerDto): Promise<any>;
}
