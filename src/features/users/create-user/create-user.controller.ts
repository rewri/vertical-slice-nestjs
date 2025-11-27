import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { CreateUserService } from './create-user.service';

@Controller('users')
export class CreateUserController {
  constructor(private readonly service: CreateUserService) {}

  @Post()
  async handle(@Body() dto: CreateUserDTO) {
    return this.service.execute(dto);
  }
}
