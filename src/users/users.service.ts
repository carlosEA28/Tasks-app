import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';
import { create } from 'domain';
import { UpdatedUserDto } from './dto/updateUserDto';
import { HashingServiceProtocol } from 'src/auth/hash/hashign.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingSerivice: HashingServiceProtocol,
  ) {}
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
    const hashedPassword = await this.hashingSerivice.hash(
      createUserDto.password,
    );

    const user = this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: hashedPassword,
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

  async updateUser(
    id: number,
    updateUserDto: UpdatedUserDto,
    tokenPayload: PayloadTokenDto,
  ) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new HttpException('User não encontrado', HttpStatus.UNAUTHORIZED);
    }

    if (userExists.id != tokenPayload.sub) {
      throw new HttpException('Acesso negado', HttpStatus.UNAUTHORIZED);
    }

    const dataUser: { name?: string; passwordHash?: string } = {
      name: updateUserDto.name ? updateUserDto.name : userExists.name,
      passwordHash: updateUserDto.password
        ? updateUserDto.password
        : userExists.passwordHash,
    };

    if (updateUserDto?.password) {
      const hashedPassword = await this.hashingSerivice.hash(
        updateUserDto?.password,
      );

      dataUser['passwordHash'] = hashedPassword;
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        name: dataUser.name,
        passwordHash: dataUser.passwordHash
          ? dataUser.passwordHash
          : userExists.passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return updateUser;
  }

  async deleteUser(id: number, tokenPayload: PayloadTokenDto) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new HttpException('User não encontrado', HttpStatus.NOT_FOUND);
    }

    if (userExist.id != tokenPayload.sub) {
      throw new HttpException('Acesso negado', HttpStatus.UNAUTHORIZED);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return { message: 'User deletado' };
  }
}
