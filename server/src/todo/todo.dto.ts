import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Misc } from 'helpers/misc';
import { Transform } from 'class-transformer';
import { Priority, Status } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDTO {
  @ApiProperty({
    example: 'Todo App',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => Misc.titleText(value))
  title: string;

  @ApiPropertyOptional({
    example: 'More coding!',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2024-12-12',
  })
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ enum: Priority })
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ enum: Status })
  @IsOptional()
  status?: Status;
}

export class UpdateTodoDTO extends PartialType(CreateTodoDTO) {}

export class PaginationDTO {
  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: 20,
  })
  @IsOptional()
  limit?: number;
}
