import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

import * as jwt from 'jsonwebtoken';

import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators';

interface JWTPayload {
    name: string;
    id: number;
    iat: number;
    exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!isPublic && !roles?.length) {
            throw new UnauthorizedException('Вы не авторизованы');
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Вы не авторизованы');
        }

        const payload = jwt.verify(
            token,
            process.env.JSON_TOKEN_KEY,
            (err, data) => {
                if (err?.message) return undefined;
                return data;
            },
        ) as JWTPayload | void;

        if (!payload) {
            throw new UnauthorizedException('Невалидный токен');
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.id,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Вы не авторизованы');
        }

        if (!roles.includes(user.user_type)) {
            throw new ForbiddenException('Нет прав');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
