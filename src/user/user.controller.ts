import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from './auth/decorators';
import { UserType } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly prismaService: PrismaService) {}

    @Roles(UserType.ADMIN)
    @Get()
    async getAllUsers() {
        return await this.prismaService.user.findMany();
    }
}
