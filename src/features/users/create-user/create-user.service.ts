import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../shared/entities/users.entity';
import { UserRepository } from '../shared/repositories/user.repository';
import { CreateUserDTO } from './create-user.dto';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDTO: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDTO.email,
    );

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    return await this.userRepository.create(createUserDTO);
  }
}
