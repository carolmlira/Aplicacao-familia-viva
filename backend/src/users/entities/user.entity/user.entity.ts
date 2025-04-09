export class UserEntity {
    name: string;
    email: string;
    password: string;
    level: string; // Pode ser validado como enum depois, se desejar
    active: boolean;
    photo?: string; // Pode ser uma URL
    phone?: string;
    whatsappOptIn: boolean;  
}
