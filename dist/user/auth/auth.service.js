"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async register({ firstName, lastName, userImage, phone, email, password, }) {
        const existingUser = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException();
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
                userType: client_1.UserType.USER,
            },
        });
        return this.generateJWT(newUser.firstName, newUser.id);
    }
    async login({ email, password }) {
        const registeredUser = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (!registeredUser) {
            throw new common_1.HttpException('Invalid Credentials', 400);
        }
        const isValidPassword = await bcrypt.compare(password, registeredUser.password);
        if (!isValidPassword) {
            throw new common_1.HttpException('Invalid Credentials', 400);
        }
        return this.generateJWT(registeredUser.firstName, registeredUser.id);
    }
    generateJWT(firstName, id) {
        return jwt.sign({ firstName, id }, process.env.JWT_KEY, {
            expiresIn: 360000000,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map