import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { UserRepository } from '../shared/repositories/user.repository';
import { ListUserController } from './list-users.controller';
import { ListUsersService } from './list-users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ListUserController],
  providers: [ListUsersService, UserRepository],
})
export class ListUserModule {}
