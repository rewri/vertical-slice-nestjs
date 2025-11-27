import { Injectable } from '@nestjs/common';
import { PaginationHelper } from '../../../core/shared/helpers/pagination.helper';
import { UserRepository } from '../shared/repositories/user.repository';
import {
  ListUsersQueryDTO,
  ListUsersResponseDTO,
  UserResponseDTO,
} from './list-users.dto';

@Injectable()
export class ListUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: ListUsersQueryDTO): Promise<ListUsersResponseDTO> {
    const { data, total } = await this.userRepository.findAllPaginated(
      query,
      query.search,
      query.email,
    );

    const mappedData: UserResponseDTO[] = data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    return PaginationHelper.createResponse(mappedData, total, query);
  }
}
