import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDTO } from '../../../../core/shared/dto/pagination-query.dto';
import { CreateUserDTO } from '../../create-user/create-user.dto';
import { User } from '../entities/users.entity';

@Injectable()
export class UserRepository {
  private userRepository: Repository<User>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findAllPaginated(
    query: PaginationQueryDTO,
    search?: string,
    email?: string,
  ): Promise<{ data: User[]; total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where('user.name LIKE :search OR user.email LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (email) {
      queryBuilder.andWhere('user.email = :email', { email });
    }

    const [data, total] = await queryBuilder
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    return { data, total };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
