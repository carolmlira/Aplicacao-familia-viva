import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        role: Role;
        ministryId: any;
        photo: any;
    }>;
}
export {};
