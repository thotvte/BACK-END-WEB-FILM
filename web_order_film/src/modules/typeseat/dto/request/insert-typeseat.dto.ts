import { IsInt, IsOptional, IsString } from 'class-validator';

export class InsertTypeSeatDto {
  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsInt()
  unitPrice: number;

  @IsOptional()
  @IsInt()
  status: number;
}
