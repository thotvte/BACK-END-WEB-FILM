import { IsOptional, IsString } from 'class-validator';

export class UpdatePassWordDto {
  @IsOptional()
  @IsString()
  oldPassword: string;

  @IsOptional()
  @IsString()
  newPassword: string;

  @IsOptional()
  @IsString()
  confirmPassword: string;
}
