import { Role } from 'src/auth/role.enum';
export declare class CreateUserDto {
    name: string;
    email: string;
    oldSenha?: string;
    password: string;
    level: Role;
    active: boolean;
    photo?: string;
    photoURL?: string;
    phone?: string;
    whatsappOptIn: boolean;
    ministryId: string;
    resetToken?: string | null;
    resetExpires?: string | null;
}
