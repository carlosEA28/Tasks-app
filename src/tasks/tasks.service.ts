import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allTasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });
    if (task?.name) return task;

    throw new HttpException('Tarefa não foi encontrada', HttpStatus.NOT_FOUND);
  }

  async create(createTaskDto: CreateTaskDto, tokenPayload: PayloadTokenDto) {
    const newTask = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false,
        userId: tokenPayload.sub,
      },
    });

    return newTask;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    tokenPayload: PayloadTokenDto,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!task) {
      throw new HttpException(
        'Tarefa não foi encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (task.userId !== tokenPayload.sub) {
      throw new HttpException(
        'Tarefa não foi encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const newTask = await this.prisma.task.update({
      where: {
        id: task.id,
      },
      data: updateTaskDto, // como sao os mesmos nomes dos campos, ele atualiza aquele que o user quiser e retorna, caso queira atualizar um campo, tem que especificar
    });

    return newTask;
  }

  async delete(id: number, tokenPayload: PayloadTokenDto) {
    const task = await this.prisma.task.delete({
      where: {
        id: id,
      },
    });

    if (!task) {
      throw new HttpException(
        'Tarefa não foi encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (task.userId !== tokenPayload.sub) {
      throw new HttpException('Erro ao deletar', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Tarefa deletada',
    };
  }
}
