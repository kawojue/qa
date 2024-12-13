import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/guardsAndStrategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'configs/env.config';
import { ResponseService } from 'libs/response.service';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      global: true,
      signOptions: {
        expiresIn: config.jwt.expiry,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ResponseService],
  exports: [AuthService],
})
export class AuthModule {}
