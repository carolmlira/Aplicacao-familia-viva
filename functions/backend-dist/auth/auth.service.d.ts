import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/email/email.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    generateResetToken(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<string>;
    sendResetEmail(email: string, token: string): Promise<void>;
}
