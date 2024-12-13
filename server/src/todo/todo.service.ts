import { CreateTodoDTO, PaginationDTO, UpdateTodoDTO } from './todo.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Misc } from 'helpers/misc';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(user: JwtDecoded, { dueDate, ...rest }: CreateTodoDTO) {
    return this.prisma.todo.create({
      data: {
        ...rest,
        author: { connect: { id: user.sub } },
        ...(dueDate && { dueDate: new Date(dueDate) }),
      },
    });
  }

  async updateTodo(
    id: string,
    user: JwtDecoded,
    { dueDate, ...rest }: UpdateTodoDTO,
  ) {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id,
        authorId: user.sub,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    let formattedDueDate: Date;

    if (dueDate) {
      formattedDueDate = new Date(dueDate);
    }

    return this.prisma.todo.update({
      where: { id: todo.id },
      data: {
        ...rest,
        ...(dueDate && { dueDate: formattedDueDate }),
      },
    });
  }

  async deleteTodo(id: string, user: JwtDecoded) {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id,
        authorId: user.sub,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.prisma.todo.delete({
      where: { id: todo.id },
    });
  }

  async fetchTodos(user: JwtDecoded, { page = 1, limit = 10 }: PaginationDTO) {
    page = Number(page);
    limit = Number(limit);

    const [todos, count] = await Promise.all([
      this.prisma.todo.findMany({
        where: { authorId: user.sub },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.todo.count({
        where: { authorId: user.sub },
      }),
    ]);

    return {
      todos,
      meta: Misc.paginateHelper(count, page, limit),
    };
  }
}
