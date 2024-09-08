import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  // ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movies } from './movie.entity';
import { Cinema } from './cinema.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Schedules {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'cinema_id' })
  cinemaId: number;

  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at' })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column()
  status: number;

  @ManyToOne(() => Movies, (movies) => movies.schedules)
  @JoinColumn({ name: 'movie_id' })
  movie: Movies;

  @ManyToOne(() => Cinema, (cinema) => cinema.schedules)
  @JoinColumn({ name: 'cinema_id' })
  cinema: Cinema;

  @OneToOne(() => Ticket, (ticket) => ticket.schedules)
  @JoinColumn({ name: 'id' })
  ticket: Ticket;
}
