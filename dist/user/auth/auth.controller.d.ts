import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<string>;
    login(body: LoginDto): Promise<string>;
}
