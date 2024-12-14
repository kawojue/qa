import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Misc } from 'helpers/misc';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';
import { EmailDTO, LoginDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';
import { CreateEmailNotificationEvent } from 'src/notification/notification.event';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private event: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  private store = new Map<string, { count: number; expiry: Date }>();

  async signup({ email, firstName, lastName, username, password }: SignupDTO) {
    const findByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (findByEmail) {
      throw new ConflictException(
        'There is already an account accosiated to this email',
      );
    }

    const findByUsername = await this.prisma.user.findFirst({
      where: {
        username: { equals: username, mode: 'insensitive' },
      },
    });

    if (findByUsername) {
      throw new ConflictException('Username is not available');
    }

    password = await Misc.hash(password);

    return this.prisma.user.create({
      data: {
        lastName,
        password,
        firstName,
        username,
        email,
      },
    });
  }

  async login({ identifier, password }: LoginDTO) {
    const MAX_PSWD_RETRIES = 3;
    const LOCK_DURATION_MINUTES = 2;

    const isEmailIdentifier = isEmail(identifier);
    const user = await this.prisma.user.findFirst({
      where: isEmailIdentifier
        ? { email: identifier }
        : { username: { equals: identifier, mode: 'insensitive' } },
    });

    if (!user) {
      throw new NotFoundException(
        `${isEmailIdentifier ? 'Email' : 'Username'} does not exist.`,
      );
    }

    const CACHE_KEY = `password:${user.id}`;
    const retryData = this.store.get(CACHE_KEY) || {
      count: 0,
      expiry: new Date(),
    };

    if (retryData.count >= MAX_PSWD_RETRIES && new Date() < retryData.expiry) {
      throw new UnauthorizedException(
        `Account locked. Please try again after ${LOCK_DURATION_MINUTES} minutes.`,
      );
    }

    const isPasswordValid = await Misc.compareHash(password, user.password);
    if (isPasswordValid) {
      this.store.delete(CACHE_KEY);

      const accessToken = await this.jwt.signAsync({ sub: user.id });
      Misc.sanitizeData<User>(user, ['password']);

      return { ...user, access_token: accessToken };
    }

    retryData.count++;
    retryData.expiry = new Date();
    retryData.expiry.setMinutes(
      retryData.expiry.getMinutes() + LOCK_DURATION_MINUTES,
    );

    if (retryData.count >= MAX_PSWD_RETRIES) {
      this.store.set(CACHE_KEY, retryData);
      throw new UnauthorizedException(
        `Maximum retry attempts reached. Account locked for ${LOCK_DURATION_MINUTES} minutes.`,
      );
    }

    this.store.set(CACHE_KEY, retryData);
    throw new UnauthorizedException(
      `Incorrect password. ${MAX_PSWD_RETRIES - retryData.count} attempts remaining.`,
    );
  }

  async requestPasswordReset({ email }: EmailDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Account does not exist');
    }

    const otp = Misc.generateOtp(5);
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);

    this.event.emit(
      'notification.email',
      new CreateEmailNotificationEvent({
        emails: user.email,
        subject: 'Verify it is you!',
        template: 'VerificationEmail',
        data: {
          code: otp,
          firstName: user.firstName,
          year: new Date().getFullYear(),
        },
      }),
    );

    await this.prisma.totp.upsert({
      where: { userId: user.id },
      create: { otp, expiry, userId: user.id },
      update: { otp, expiry },
    });
  }

  async resetPassword({ code, password }: ResetPasswordDTO) {
    const totp = await this.prisma.totp.findFirst({
      where: { otp: code },
    });

    if (!totp) {
      throw new UnauthorizedException('Incorrect code');
    }

    if (new Date() > totp.expiry) {
      await this.prisma.totp.delete({ where: { id: totp.id } });
      throw new ForbiddenException('OTP has expired');
    }

    const hashedPassword = await Misc.hash(password);

    await this.prisma.user.update({
      where: { id: totp.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.totp.delete({ where: { id: totp.id } });
  }
}
