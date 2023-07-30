import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
    imports: [PrismaModule],
    providers: [],
    controllers: [UserController],
})
export class UserModule {}
