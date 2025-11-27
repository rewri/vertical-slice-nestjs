import { Controller, Get, Query } from '@nestjs/common';
import { ListUsersQueryDTO } from './list-users.dto';
import { ListUsersService } from './list-users.service';

@Controller('users')
export class ListUserController {
  constructor(private readonly service: ListUsersService) {}

  @Get()
  async handle(@Query() query: ListUsersQueryDTO) {
    return this.service.execute(query);
  }
}
