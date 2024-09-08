import { IsString } from 'class-validator';

export class LoginAccountCusDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
