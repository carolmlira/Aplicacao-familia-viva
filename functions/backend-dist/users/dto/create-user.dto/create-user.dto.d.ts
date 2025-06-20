import { Role } from 'src/auth/role.enum';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    level: Role;
    active: boolean;
    photoURL?: string;
    phone?: string;
    ministryId: string;
    resetToken?: string | null;
    resetExpires?: string | null;
}
