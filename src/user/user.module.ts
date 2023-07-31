import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [PrismaModule],
    providers: [AuthService],
    controllers: [UserController, AuthController],
})
export class UserModule {}
