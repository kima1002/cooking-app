import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: Partial<import("../users/user.schema").User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: Partial<import("../users/user.schema").User>;
    }>;
}
