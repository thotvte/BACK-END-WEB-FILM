import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class InsertProductItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  stock: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  rating: number;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  categoryId: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  supplierId: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  productIds: number[];
}
