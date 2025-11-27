import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/core/shared/dto/pagination-query.dto';
import { PaginationResponseDTO } from 'src/core/shared/dto/pagination-response.dto';

export class ListUsersQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class UserResponseDTO {
  id: number;
  name: string;
  email: string;
}

export class ListUsersResponseDTO extends PaginationResponseDTO<UserResponseDTO> {
  // Herda automaticamente:
  // - data: UserResponseDto[]
  // - meta: PaginationMetaDto
}
