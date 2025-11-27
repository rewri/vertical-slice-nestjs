import { Type } from 'class-transformer';

export class PaginationMetaDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginationResponseDTO<T> {
  data: T[];

  @Type(() => PaginationMetaDTO)
  meta: PaginationMetaDTO;

  constructor(data: T[], meta: PaginationMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}
