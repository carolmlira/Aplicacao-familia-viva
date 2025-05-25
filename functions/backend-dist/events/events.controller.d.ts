import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-events.dto/create-events.dto';
import { EventEntity } from './entities/event.entity/event.entity';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<EventEntity>;
    findAll(): Promise<EventEntity[]>;
    findOne(id: string): Promise<EventEntity>;
    update(id: string, updateEventDto: Partial<CreateEventDto>): Promise<EventEntity>;
    remove(id: string): Promise<{
        message: string;
        deleted: EventEntity;
    }>;
}
