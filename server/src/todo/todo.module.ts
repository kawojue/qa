import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ResponseService } from 'libs/response.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, ResponseService],
  exports: [TodoService],
})
export class TodoModule {}
