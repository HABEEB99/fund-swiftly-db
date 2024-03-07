import { PrismaService } from 'src/prisma/prisma.service';
interface IRegister {
    firstName: string;
    lastName: string;
    userImage?: string;
    phone: string;
    email: string;
    password: string;
}
interface ILogin {
    email: string;
    password: string;
}
export declare class AuthService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    register({ firstName, lastName, userImage, phone, email, password, }: IRegister): Promise<string>;
    login({ email, password }: ILogin): Promise<string>;
    private generateJWT;
}
export {};
