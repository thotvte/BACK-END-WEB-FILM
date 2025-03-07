import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedule.service';
import { InsertSchedulesDto } from './dto/request/insert-schedules.dto';
import { Public } from '../auth/auth.setmetadata';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';

@Controller('/schedules')
export class scheduleController {
  constructor(private schedulesService: SchedulesService) {}

  @Public()
  @Get('/:id')
  getSchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.schedulesService.getSchedule(id);
  }

  @Public()
  @Get('')
  getSchedules() {
    return this.schedulesService.getSchedules();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('')
  insertSchedule(@Body() body: InsertSchedulesDto) {
    return this.schedulesService.addSchedule(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/:id')
  updateSchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Body() data: InsertSchedulesDto,
  ) {
    return this.schedulesService.updateSchedule(id, data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  async deleteSchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    await this.schedulesService.deleteSchedule(id);
  }

  // New API to get seats based on cinemaId and scheduleId
  @Public()
  @Get('/:id/seats')
  async getSeatsBySchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Query('cinemaId', { transform: (value) => Number(value) })
    cinemaId: number,
  ) {
    return this.schedulesService.getSeatsBySchedule(id, cinemaId);
  }
}
