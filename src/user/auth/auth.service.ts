import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';

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

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async register({
    firstName,
    lastName,
    userImage,
    phone,
    email,
    password,
  }: IRegister) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        firstName,
        lastName,
        phone,
        userImage,
        email,
        password: hashedPassword,
        userType: UserType.USER,
      },
    });

    return this.generateJWT(newUser.firstName, newUser.id);
  }

  async login({ email, password }: ILogin) {
    const registeredUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!registeredUser) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const isValidPassword = await bcrypt.compare(
      password,
      registeredUser.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    return this.generateJWT(registeredUser.firstName, registeredUser.id);
  }

  private generateJWT(firstName: string, id: string) {
    return jwt.sign({ firstName, id }, process.env.JWT_KEY, {
      expiresIn: 360000000,
    });
  }
}
