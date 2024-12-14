import { Misc } from 'helpers/misc';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailDTO {
  @ApiProperty({
    example: 'email@email.com',
  })
  @IsEmail()
  @Transform(({ value }) => Misc.formatEmail(value))
  email: string;
}

export class SignupDTO extends EmailDTO {
  @ApiProperty({
    example: 'Qwerty123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => Misc.titleText(value))
  firstName: string;

  @ApiPropertyOptional({
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => Misc.titleText(value))
  lastName?: string;
}

export class LoginDTO {
  @ApiProperty({
    example: 'johndoe',
    description: 'This can either be username or email',
  })
  @IsString()
  @Transform(({ value }) => Misc.toLowerCase(value))
  identifier: string;

  @ApiProperty({
    example: 'Qwerty123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDTO {
  @ApiProperty({
    example: '00000',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Qwerty123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
