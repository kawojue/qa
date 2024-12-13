import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtGuard } from 'src/guardsAndStrategies/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTodoDTO, PaginationDTO, UpdateTodoDTO } from './todo.dto';
import { ResponseService } from 'libs/response.service';
import { GetUser } from 'src/guardsAndStrategies/auth-param.decorator';

@ApiBearerAuth()
@Controller('todo')
@UseGuards(JwtGuard)
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly httpResponse: ResponseService,
  ) {}

  @Post()
  async createTodo(
    @Res() res: Response,
    @GetUser() user: JwtDecoded,
    @Body() body: CreateTodoDTO,
  ) {
    const data = await this.todoService.createTodo(user, body);
    return this.httpResponse.sendSuccess(res, HttpStatus.CREATED, { data });
  }

  @Put(':id')
  async updateTodo(
    @Res() res: Response,
    @Param('id') id: string,
    @GetUser() user: JwtDecoded,
    @Body() body: UpdateTodoDTO,
  ) {
    const data = await this.todoService.updateTodo(id, user, body);
    return this.httpResponse.sendSuccess(res, HttpStatus.OK, { data });
  }

  @Delete(':id')
  async deleteTodo(
    @Res() res: Response,
    @Param('id') id: string,
    @GetUser() user: JwtDecoded,
  ) {
    await this.todoService.deleteTodo(id, user);
    return this.httpResponse.sendNoContent(res);
  }

  @Get()
  async fetchTodos(
    @Res() res: Response,
    @GetUser() user: JwtDecoded,
    @Query() query: PaginationDTO,
  ) {
    const data = await this.todoService.fetchTodos(user, query);
    return this.httpResponse.sendSuccess(res, HttpStatus.OK, { data });
  }
}
