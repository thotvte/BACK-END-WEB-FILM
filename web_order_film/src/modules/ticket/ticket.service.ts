import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InsertTicketCusDto } from './dto/request/insert-ticketCus.dto';
import { InsertTicketCusResponse } from './dto/response/insert-ticketCus.dto';
import { Movies } from 'src/entities/movie.entity';
import { Seat } from 'src/entities/seat.entity';
import { TypeSeat } from 'src/entities/typeSeat';
import { Schedules } from 'src/entities/schedule.entity';
import { movieTimesPrice } from 'src/entities/movieTimesPrice.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketReponsitory: Repository<Ticket>,
    @InjectRepository(Movies)
    private movieReponsitory: Repository<Movies>,
    @InjectRepository(Seat)
    private seatReponsitory: Repository<Seat>,
    @InjectRepository(TypeSeat)
    private typeSeatReponsitory: Repository<TypeSeat>,
    @InjectRepository(Schedules)
    private schedulesReponsitory: Repository<Schedules>,
    @InjectRepository(movieTimesPrice)
    private movieTimesPriceReponsitory: Repository<movieTimesPrice>,
  ) {}

  async getTicket(id: number) {
    const result = await this.ticketReponsitory.findOne({
      where: { id },
      relations: ['seat', 'schedules'],
    });
    return result;
  }

  async getTickets() {
    const result = this.ticketReponsitory.find({
      relations: ['seat', 'schedules'],
    });
    console.log(result);
    return result;
  }

  async addTicket(
    dataCus: InsertTicketCusDto,
  ): Promise<InsertTicketCusResponse> {
    const seat = await this.seatReponsitory.findOne({
      where: { id: dataCus.seatId },
      relations: ['typeSeat'],
    });
    if (!seat) {
      throw new Error(`ID ghế : ${dataCus.seatId} hiện không tồn tại`);
    }

    const schedule = await this.schedulesReponsitory.findOne({
      where: { id: dataCus.schedulesId },
      relations: ['cinema', 'movie', 'movie.movieTimesPrices'],
    });
    if (!schedule) {
      throw new BadRequestException(
        `ID lịch chiếu : ${dataCus.schedulesId} hiện không tồn tại`,
      );
    }

    const time = await this.movieTimesPriceReponsitory.findOne({
      where: {
        startTime: LessThanOrEqual(schedule.startTime),
        endTime: MoreThanOrEqual(schedule.startTime),
      },
    });
    if (!time) {
      throw new Error(`Không tìm thấy giá vé phù hợp cho lịch chiếu này`);
    }

    const unitPrice = Number(seat.typeSeat.unitPrice) + Number(time.unitPrice);

    const newTicket: Ticket = this.ticketReponsitory.create({
      ...dataCus,
      nameMovie: schedule.movie.name,
      schedule: schedule.startTime,
      unitPrice: unitPrice,
      total: unitPrice * 1,
      status: 1,
    });

    const saveTicket = await this.ticketReponsitory.save(newTicket);
    return saveTicket;
  }

  async updateTicket(id: number, data: InsertTicketCusDto): Promise<string> {
    const ticket = await this.ticketReponsitory.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Không tìm thấy ticket với id ${id}`);
    }

    const seat = await this.seatReponsitory.findOne({
      where: { id: data.seatId },
      relations: ['typeSeat'],
    });
    if (!seat) {
      throw new NotFoundException(`ID ghế : ${data.seatId} không tồn tại`);
    }

    const schedule = await this.schedulesReponsitory.findOne({
      where: { id: data.schedulesId },
      relations: ['cinema', 'movie', 'movie.movieTimesPrices'],
    });
    if (!schedule) {
      throw new NotFoundException(
        `ID lịch chiếu : ${data.schedulesId} không tồn tại`,
      );
    }

    const time = await this.movieTimesPriceReponsitory.findOne({
      where: {
        startTime: LessThanOrEqual(schedule.startTime),
        endTime: MoreThanOrEqual(schedule.startTime),
      },
    });
    if (!time) {
      throw new Error(`Không tìm thấy giá vé phù hợp cho lịch chiếu này`);
    }
    const unitPrice = Number(seat.typeSeat.unitPrice) + Number(time.unitPrice);
    const updatedTicket = this.ticketReponsitory.merge(ticket, {
      ...data,
      nameMovie: schedule.movie.name,
      schedule: schedule.startTime,
      unitPrice: unitPrice,
      total: unitPrice * 1,
      status: 1,
    });

    await this.ticketReponsitory.save(updatedTicket);
    return 'Cập nhật ticket thành công';
  }

  async deleteTicket(id: number): Promise<string> {
    await this.ticketReponsitory.softRemove({ id });
    return 'đã xóa thành công';
  }
}
