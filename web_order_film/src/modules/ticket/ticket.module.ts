import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { Movies } from 'src/entities/movie.entity';
import { Seat } from 'src/entities/seat.entity';
import { Schedules } from 'src/entities/schedule.entity';
import { TypeSeat } from 'src/entities/typeSeat';
import { movieTimesPrice } from 'src/entities/movieTimesPrice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Movies,
      Seat,
      Schedules,
      TypeSeat,
      movieTimesPrice,
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
