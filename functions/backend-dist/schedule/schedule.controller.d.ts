import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    create(dto: CreateScheduleDto): Promise<{
        ministryId: string;
        userId: string;
        date: string;
        description: string;
        time: string;
        available: boolean;
        confirmed?: boolean;
        id: string;
    }>;
    findAll(): Promise<FirebaseFirestore.DocumentData[]>;
    findConfirmedByMinistry(req: any): Promise<FirebaseFirestore.DocumentData[]>;
    findAvailableByMyMinistry(req: any): Promise<FirebaseFirestore.DocumentData[]>;
    findOne(id: string): Promise<FirebaseFirestore.DocumentData | null | undefined>;
    update(id: string, dto: CreateScheduleDto): Promise<FirebaseFirestore.DocumentData | undefined>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    findByUser(userId: string): Promise<FirebaseFirestore.DocumentData[]>;
    findByUser2(userId: string): Promise<FirebaseFirestore.DocumentData[]>;
    findAllAvailable(): Promise<FirebaseFirestore.DocumentData[]>;
    findAllConfirmed(): Promise<FirebaseFirestore.DocumentData[]>;
}
