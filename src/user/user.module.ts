import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
    imports: [PrismaModule],
    providers: [AuthService],
    controllers: [AuthController, UserController],
})
export class UserModule {}
