import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.servicer';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';
import { UpdateProfileMeDto } from './dto/request/update-profile.dto';
import { RegisterCustomerDto } from './dto/request/register-customer.dto';
import { Public } from '../auth/auth.setmetadata';
import { UpdatePassWordDto } from './dto/request/update-passWord.dto';
import { updatePassWordCustomerDto } from './dto/request/update-passWorkCustomer.dto';
import { Customer } from 'src/entities/customer.entity';

@Controller('/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Roles(Role.Admin)
  @Get('/search')
  searchCus(@Query('firstName') name: string): Promise<Customer[]> {
    return this.customerService.getfirstName(name);
  }

  @Roles(Role.Admin)
  @Get('/by-year')
  async getByBirthYear(@Query('birthDate') year: number): Promise<Customer[]> {
    return this.customerService.getByBirthYear(year);
  }

  @Get('/me')
  async getCustomerMe(@Req() req: any) {
    const userId = req.user.id;
    const accountEmployee = await this.customerService.getCustomerMe(userId);
    return accountEmployee;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('/:id')
  getCustomer(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.customerService.getCustomer(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get()
  getCustomers() {
    return this.customerService.getCustomers();
  }

  @Public()
  @Post('/register')
  register(@Body() body: RegisterCustomerDto) {
    return this.customerService.register(body);
  }

  @Put('/profile/me')
  UpdateProfileMe(
    @Body() updateCustomerMeDto: UpdateProfileMeDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.customerService.updateProfileMe(userId, updateCustomerMeDto);
  }

  @Put('/password/me')
  @UseGuards(AuthGuard)
  UpdatePassWordMe(@Body() updatePassWord: UpdatePassWordDto, @Req() req: any) {
    const userId = req.user.id;
    return this.customerService.updatePassWordMe(userId, updatePassWord);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Put('/password/:id')
  UpdatePassWord(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Body() updatePassWord: updatePassWordCustomerDto,
  ) {
    return this.customerService.updatePassWord(id, updatePassWord);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Delete('/:id')
  async deleteCustomer(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.customerService.deleteCustomer(id);
  }
}
