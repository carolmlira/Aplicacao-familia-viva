import { MinistriesService } from './ministries.service';
import { CreateMinistriesDto } from './dto/create-ministry.dto/create-ministry.dto';
export declare class MinistriesController {
    private readonly ministriesService;
    constructor(ministriesService: MinistriesService);
    create(createMinistriesDto: CreateMinistriesDto): Promise<import("./entities/ministry.entity/ministry.entity").MinistryEntity>;
    findAll(): Promise<import("./entities/ministry.entity/ministry.entity").MinistryEntity[]>;
    findOne(id: string): Promise<import("./entities/ministry.entity/ministry.entity").MinistryEntity>;
    update(id: string, updateMinistryDto: Partial<CreateMinistriesDto>): Promise<import("./entities/ministry.entity/ministry.entity").MinistryEntity>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
