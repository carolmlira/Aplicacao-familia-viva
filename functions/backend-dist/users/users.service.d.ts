import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
export declare class UsersService {
    private collection;
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | undefined>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    updateResetToken(id: string, token: string, expires: Date): Promise<FirebaseFirestore.WriteResult>;
    verifyResetToken(token: string): Promise<UserEntity | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
