import { CreateMinistriesDto } from './dto/create-ministry.dto/create-ministry.dto';
import { MinistryEntity } from './entities/ministry.entity/ministry.entity';
export declare class MinistriesService {
    private collection;
    create(createMinistriesDto: CreateMinistriesDto): Promise<MinistryEntity>;
    findAll(): Promise<MinistryEntity[]>;
    findOne(id: string): Promise<MinistryEntity>;
    update(id: string, updateData: Partial<CreateMinistriesDto>): Promise<MinistryEntity>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
