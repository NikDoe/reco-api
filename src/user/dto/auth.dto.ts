import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @IsString({ message: 'имя должно быть строкой' })
    @IsNotEmpty({ message: 'имя не должно быть пустым' })
    firstName: string;

    @IsString({ message: 'фамилия должна быть строкой' })
    @IsNotEmpty({ message: 'фамилия не должна быть пустой' })
    lastName: string;

    @IsEmail({}, { message: 'некорректный формат email' })
    @IsNotEmpty({ message: 'email не должен быть пустым' })
    email: string;

    @IsNotEmpty({ message: 'пароль не должен быть пустым' })
    @MinLength(5, { message: 'минимальная длинна пароля 5 символов' })
    password: string;
}

export class SigninDto {
    @IsEmail({}, { message: 'некорректный формат email' })
    @IsNotEmpty({ message: 'email не должен быть пустым' })
    email: string;

    @IsNotEmpty({ message: 'пароль не должен быть пустым' })
    password: string;
}
