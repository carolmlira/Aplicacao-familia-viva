export interface EventEntity {
    id: string;
    title: string;
    description?: string;
    days: string[]; // Ex: ["Tuesday", "Sunday"]
    time: string;
    location?: string;
    hasSchedule: boolean;
    ministry?: string;
    recurrenceRule?: string; 
    createdAt: Date;
}
