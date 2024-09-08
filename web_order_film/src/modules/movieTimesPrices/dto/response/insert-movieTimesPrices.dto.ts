import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class InsertMovieTimesPriceDto {
  @IsOptional()
  @IsInt()
  unitPrice: number;

  @IsOptional()
  @IsInt()
  movieId: number;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;
}
