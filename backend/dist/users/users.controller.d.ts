import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<import("./user.schema").UserDocument>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<import("./user.schema").UserDocument>;
}
