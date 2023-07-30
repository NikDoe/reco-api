import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
    constructor(private readonly prismaService: PrismaService) {}

    @Get()
    async getAllUsers() {
        return await this.prismaService.user.findMany();
    }
}
