import { Module } from '@nestjs/common';
import { CreateUserModule } from './create-user/create-user.module';
import { ListUserModule } from './list-users/list-users.module';

@Module({
  imports: [CreateUserModule, ListUserModule],
})
export class UsersModule {}
