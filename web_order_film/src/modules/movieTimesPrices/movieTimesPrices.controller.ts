import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MovieTimesPriceService } from './movieTimesPrices.service';
import { Public } from '../auth/auth.setmetadata';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';
import { InsertMovieTimesPriceDto } from './dto/response/insert-movieTimesPrices.dto';

@Controller('/movieTimesPrice')
export class MovieTimesPriceController {
  constructor(private movieTimesPriceService: MovieTimesPriceService) {}

  @Public()
  @Get('/:id')
  getSchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.movieTimesPriceService.getMTP(id);
  }

  @Public()
  @Get('')
  getSchedules() {
    return this.movieTimesPriceService.getMTPs();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('')
  insertSchedule(@Body() body: InsertMovieTimesPriceDto) {
    return this.movieTimesPriceService.addMTP(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/:id')
  updateSchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
    @Body() data: InsertMovieTimesPriceDto,
  ) {
    return this.movieTimesPriceService.updateMTP(id, data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  async deleteSchedule(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    await this.movieTimesPriceService.deleteMTP(id);
  }

  @Get('movie/:id')
  async getMovieTimesPricesByMovieId(
    @Param('id', { transform: (value) => Number(value) }) id: number,
  ) {
    return this.movieTimesPriceService.getMovieInMTP(id);
  }
}
