import { PaginationQueryDTO } from '../dto/pagination-query.dto';
import {
  PaginationMetaDTO,
  PaginationResponseDTO,
} from '../dto/pagination-response.dto';

export class PaginationHelper {
  static createResponse<T>(
    data: T[],
    total: number,
    query: PaginationQueryDTO,
  ): PaginationResponseDTO<T> {
    const totalPages =
      total > 0 && query.limit > 0 ? Math.ceil(total / query.limit) : 1;
    const meta: PaginationMetaDTO = {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    };

    return new PaginationResponseDTO(data, meta);
  }
}
