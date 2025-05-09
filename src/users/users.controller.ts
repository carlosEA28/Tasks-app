import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { UpdatedUserDto } from './dto/updateUserDto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/common/auth.contants';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdatedUserDto,
    @Req() req: Request,
  ) {
    console.log(req[REQUEST_TOKEN_PAYLOAD_NAME]);

    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {}
}
