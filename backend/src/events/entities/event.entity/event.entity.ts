export class EventEntity {
    title: string;
    description?: string;
    days: string[]; // Ex: ["Tuesday", "Sunday"]
    time: string;
    location?: string;
    hasSchedule: boolean;
    ministry?: string;
    recurrenceRule?: string; 
}
