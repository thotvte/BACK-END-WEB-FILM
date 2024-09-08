import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class InsertSchedulesDto {
  @IsOptional()
  @IsInt()
  movieId: number;

  @IsOptional()
  @IsInt()
  cinemaId: number;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsOptional()
  @IsInt()
  status: number;
}
