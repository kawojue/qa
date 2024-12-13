import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseService } from 'libs/response.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guardsAndStrategies/jwt.guard';
import { EmailDTO, LoginDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';
import { GetUser } from 'src/guardsAndStrategies/auth-param.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpResponse: ResponseService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async auth(@Res() res: Response, @GetUser() user: JwtDecoded) {
    return this.httpResponse.sendSuccess(res, HttpStatus.OK, {
      username: user.username,
    });
  }

  @Post('signup')
  async signup(@Res() res: Response, @Body() body: SignupDTO) {
    await this.authService.signup(body);
    return this.httpResponse.sendSuccess(res, HttpStatus.CREATED, {
      message: 'Account created successfully',
    });
  }

  @Post('login')
  async login(@Res() res: Response, @Body() body: LoginDTO) {
    const data = await this.authService.login(body);
    return this.httpResponse.sendSuccess(res, HttpStatus.OK, {
      data,
      message: 'Login successfully',
    });
  }

  @Post('/password/request')
  async requestPasswordReset(@Res() res: Response, @Body() body: EmailDTO) {
    await this.authService.requestPasswordReset(body);
    return this.httpResponse.sendSuccess(res, HttpStatus.OK, {
      message: 'OTP has been sent to your email',
    });
  }

  @Post('/password/reset')
  async resetPassword(@Res() res: Response, @Body() body: ResetPasswordDTO) {
    await this.authService.resetPassword(body);
    return this.httpResponse.sendSuccess(res, HttpStatus.OK, {
      message: 'Password has been successfully reset.',
    });
  }
}
