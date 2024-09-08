import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertSchedulesResponse } from './dto/response/insert-schedules.dto';
import { InsertSchedulesDto } from './dto/request/insert-schedules.dto';
import { Schedules } from 'src/entities/schedule.entity';
import { Seat } from 'src/entities/seat.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
  ) {}

  async getSchedule(id: number) {
    const result = await this.schedulesRepository.findOne({
      where: {
        id,
      },
      relations: ['movie', 'cinema'],
    });
    return result;
  }

  async getSchedules() {
    const result = await this.schedulesRepository.find({
      relations: ['movie', 'cinema'],
    });
    return result;
  }

  async addSchedule(
    data: InsertSchedulesDto,
  ): Promise<InsertSchedulesResponse> {
    const addSchedule = data;
    const newSchedule = this.schedulesRepository.create(addSchedule);
    const saveSchedule = await this.schedulesRepository.save(newSchedule);
    return saveSchedule;
  }

  async updateSchedule(id: number, data: InsertSchedulesDto): Promise<string> {
    const getId = await this.schedulesRepository.findOne({ where: { id } });
    if (!getId) {
      throw new NotFoundException(`không tìm thấy schedule với id ${id}`);
    }
    const update = this.schedulesRepository.merge(getId, data);
    await this.schedulesRepository.save(update);
    return 'đã cập nhật thành công';
  }

  async deleteSchedule(id: number): Promise<string> {
    await this.schedulesRepository.softRemove({ id });
    return 'đã xóa thành công';
  }

  async getSeatsBySchedule(
    scheduleId: number,
    cinemaId: number,
  ): Promise<Seat[]> {
    return this.seatsRepository.find({
      where: {
        id: scheduleId,
        cinemaId: cinemaId,
      },
    });
  }
}
