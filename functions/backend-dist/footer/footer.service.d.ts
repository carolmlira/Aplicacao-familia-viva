import { CreateFooter } from './dto/create-footer/create-footer';
import { UpdateFooter } from './dto/update-footer/update-footer';
export declare class FooterService {
    private collection;
    private docId;
    getFooter(): Promise<{
        id: string;
    } | null>;
    updateFooter(data: UpdateFooter): Promise<{
        id: string;
    }>;
    createFooter(data: CreateFooter): Promise<{
        contato: string;
        localizacao: string;
        telefone: string;
        id: string;
    }>;
}
