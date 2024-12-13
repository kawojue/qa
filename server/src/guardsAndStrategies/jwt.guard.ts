import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Misc } from 'helpers/misc';
import { JwtService } from '@nestjs/jwt';
import { config } from 'configs/env.config';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      return false;
    }

    const authHeader = request.headers.authorization;
    const access_token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!access_token) return false;

    try {
      const decoded = (await this.jwtService.verifyAsync(access_token, {
        secret: config.jwt.secret,
        ignoreExpiration: false,
      })) as JwtDecoded;

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        return false;
      }

      Misc.sanitizeData(user, ['password']);

      request.user = { ...decoded, username: user.username };

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
