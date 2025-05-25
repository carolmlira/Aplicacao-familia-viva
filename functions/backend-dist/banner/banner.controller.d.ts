import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner/create-banner';
import { UpdateBannerDto } from './dto/update-banner/update-banner';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    create(files: {
        imagemLogo?: Express.Multer.File;
        imagemBanner?: Express.Multer.File;
    }, body: CreateBannerDto): Promise<{
        frase: string | undefined;
        imagemLogo: string;
        imagemBanner: string;
        createdAt: Date;
        id: string;
    }>;
    update(id: string, files: {
        imagemLogo?: Express.Multer.File[];
        imagemBanner?: Express.Multer.File[];
    }, body: UpdateBannerDto): Promise<any>;
    findOne(): Promise<{
        id: string;
    }[]>;
}
