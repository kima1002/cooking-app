import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(registerDto: RegisterDto): Promise<UserDocument>;
    findById(id: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument>;
}
