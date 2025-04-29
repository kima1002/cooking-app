import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../users/user.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: Partial<User>;
    }>;
    private generateToken;
    private sanitizeUser;
}
