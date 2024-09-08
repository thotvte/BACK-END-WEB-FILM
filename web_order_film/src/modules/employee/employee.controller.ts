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
import { EmployeeService } from './employee.service';
import { InsertEmployeeDto } from './dto/request/insert-employee.dto';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';
import { RolesGuard } from '../authorization/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { updatePassWordCustomerDto } from '../customer/dto/request/update-passWorkCustomer.dto';
import { UpdateProfileEmployeeMeDto } from './dto/request/update-profileMe.dto';
import { UpdatePassWordMeDto } from './dto/request/update-passWordMe.dto';
import { Employee } from 'src/entities/employee.entity';

@Controller('/employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Roles(Role.Admin)
  @Get('search')
  searchEmp(@Query('firstName') name: string): Promise<Employee[]> {
    return this.employeeService.getfirstName(name);
  }

  @Roles(Role.Admin)
  @Get('by-year')
  async getByBirthYear(@Query('birthDate') year: number): Promise<Employee[]> {
    return this.employeeService.getByBirthYear(year);
  }

  @Get('/me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async getAccountEmployeeMe(@Req() req: any) {
    const userId = req.user.id;
    const accountEmployee = await this.employeeService.getEmployeeMe(userId);
    return accountEmployee;
  }

  @Get('/:id')
  @Roles(Role.Admin)
  getEmployee(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.employeeService.getEmployee(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('')
  getEmployees() {
    return this.employeeService.getEmployees();
  }

  @Roles(Role.Admin)
  @Post('')
  insertSeat(@Body() body: InsertEmployeeDto) {
    return this.employeeService.addEmployee(body);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Put('/profile/me')
  UpdateProfileMe(
    @Body() updateCustomerMeDto: UpdateProfileEmployeeMeDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.employeeService.updateProfileMe(userId, updateCustomerMeDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Put('/password/me')
  @UseGuards(AuthGuard)
  UpdatePassWorkMe(
    @Body() updatePassWord: UpdatePassWordMeDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.employeeService.updatePassWordMe(userId, updatePassWord);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/password/:id')
  @UseGuards(AuthGuard)
  UpdatePassWord(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Body() updatePassWord: updatePassWordCustomerDto,
  ) {
    return this.employeeService.updatePassWord(id, updatePassWord);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async deleteEmployee(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.employeeService.deleteEmployee(id);
  }
}
