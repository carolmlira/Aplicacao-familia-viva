import { FooterService } from './footer.service';
import { UpdateFooter } from './dto/update-footer/update-footer';
import { CreateFooter } from './dto/create-footer/create-footer';
export declare class FooterController {
    private readonly footerService;
    constructor(footerService: FooterService);
    getFooter(): Promise<{
        id: string;
    } | null>;
    updateFooter(updateDto: UpdateFooter): Promise<{
        id: string;
    }>;
    createFooter(createDto: CreateFooter): Promise<{
        contato: string;
        localizacao: string;
        telefone: string;
        id: string;
    }>;
}
