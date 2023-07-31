import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface SigninParams {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}

    async signup(
        { email, password, firstName, lastName }: SignupParams,
        userType: UserType,
    ) {
        const userExists = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });

        if (userExists) {
            throw new ConflictException(
                'Пользователь с таким email уже существует',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prismaService.user.create({
            data: {
                email,
                first_name: firstName,
                last_name: lastName,
                password: hashedPassword,
                user_type: userType,
            },
        });

        const name = `${firstName} ${lastName}`;

        return this.generateJWT(name, user.id);
    }

    async signin({ email, password }: SigninParams) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new HttpException('Неверные данные', 400);
        }

        const hashedPassword = user.password;

        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {
            throw new HttpException('Неверные данные', 400);
        }

        const name = `${user.first_name} ${user.last_name}`;

        return this.generateJWT(name, user.id);
    }

    private generateJWT(name: string, id: number) {
        return jwt.sign(
            {
                name,
                id,
            },
            process.env.JSON_TOKEN_KEY,
            {
                expiresIn: 3600000,
            },
        );
    }
}
