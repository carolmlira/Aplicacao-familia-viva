import { SobreService } from './sobre.service';
import { CreateSobre } from './dto/create-sobre.dto/create-sobre';
import { UpdateSobre } from './dto/update-sobre.dto/update-sobre';
export declare class SobreController {
    private readonly sobreService;
    constructor(sobreService: SobreService);
    create(file: Express.Multer.File, body: CreateSobre): Promise<any>;
    update(id: string, file: Express.Multer.File, body: UpdateSobre): Promise<any>;
    findAll(): Promise<{
        id: string;
    }[]>;
    remove(id: string): Promise<{
        deleted: boolean;
    } | null>;
}
