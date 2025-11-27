import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../core/database/database.module';
import { UserRepository } from '../shared/repositories/user.repository';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from './create-user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserController],
  providers: [CreateUserService, UserRepository],
})
export class CreateUserModule {}
