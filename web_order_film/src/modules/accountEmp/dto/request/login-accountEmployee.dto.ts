import { IsString } from 'class-validator';

export class LoginAccountEmployeeDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
