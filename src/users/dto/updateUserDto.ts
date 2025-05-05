import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto';

export class UpdatedUserDto extends PartialType(CreateUserDto) {}
