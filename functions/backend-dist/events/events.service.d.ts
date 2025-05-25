import { CreateEventDto } from './dto/create-events.dto/create-events.dto';
import { EventEntity } from './entities/event.entity/event.entity';
export declare class EventsService {
    private collection;
    create(event: CreateEventDto): Promise<EventEntity>;
    findAll(): Promise<EventEntity[]>;
    findOne(id: string): Promise<EventEntity>;
    update(id: string, updateEventDto: Partial<CreateEventDto>): Promise<EventEntity>;
    remove(id: string): Promise<{
        message: string;
        deleted: EventEntity;
    }>;
}
