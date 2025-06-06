import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
export declare class ScheduleService {
    private collection;
    create(createScheduleDto: CreateScheduleDto): Promise<{
        ministryId: string;
        userId: string;
        date: string;
        description: string;
        available: boolean;
        confirmed?: boolean;
        id: string;
    }>;
    findAvailableByMinistry(userId: string): Promise<FirebaseFirestore.DocumentData[]>;
    findConfirmedByMinistry(userId: string): Promise<FirebaseFirestore.DocumentData[]>;
    findAll(): Promise<FirebaseFirestore.DocumentData[]>;
    findOne(id: string): Promise<FirebaseFirestore.DocumentData | null | undefined>;
    update(id: string, updateDto: Partial<CreateScheduleDto>): Promise<FirebaseFirestore.DocumentData | undefined>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    findByUser(userId: string): Promise<FirebaseFirestore.DocumentData[]>;
    findByUser2(userId: string): Promise<FirebaseFirestore.DocumentData[]>;
    findAllAvailable(): Promise<FirebaseFirestore.DocumentData[]>;
    findAvailableByMyMinistry(ministryId: String): Promise<FirebaseFirestore.DocumentData[]>;
    findAllConfirmed(): Promise<FirebaseFirestore.DocumentData[]>;
}
