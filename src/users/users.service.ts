import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';
import { create } from 'domain';
import { UpdatedUserDto } from './dto/updateUserDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        Task: true,
      },
    });

    if (user) return user;

    throw new HttpException('User não encontrado', HttpStatus.NOT_FOUND);
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: createUserDto.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (user) return user;
    throw new HttpException('Erro ao criar o usuario', HttpStatus.BAD_REQUEST);
  }

  async updateUser(id: number, updateUserDto: UpdatedUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new HttpException('User não encontrado', HttpStatus.NOT_FOUND);
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        name: updateUserDto.name ? updateUserDto.name : userExists.name, // se ele mandar algo atualiza, senao, mantem o que esta savlo no banco
        email: updateUserDto.email ? updateUserDto.email : userExists.email, // se ele mandar algo atualiza, senao, mantem o que esta savlo no banco
        passwordHash: updateUserDto.password
          ? updateUserDto.password
          : userExists.passwordHash, // se ele mandar algo atualiza, senao, mantem o que esta savlo no banco
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return updateUser;
  }

  async deleteUser(id: number) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new HttpException('User não encontrado', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return { message: 'User deletado' };
  }
}
