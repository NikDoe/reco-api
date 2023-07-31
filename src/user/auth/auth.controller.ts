import { Body, Controller, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import { SigninDto, SignupDto } from '../dto/auth.dto';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/signup/:userType')
    async signup(
        @Body() body: SignupDto,
        @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
    ) {
        return await this.authService.signup(body, userType);
    }

    @Public()
    @Post('/signin')
    async signin(@Body() body: SigninDto) {
        return this.authService.signin(body);
    }
}
