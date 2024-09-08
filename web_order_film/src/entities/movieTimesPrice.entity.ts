import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movies } from './movie.entity';

@Entity({ name: 'movie_times_price' })
export class movieTimesPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ type: 'datetime', name: 'start_time' })
  startTime: Date;

  @Column({ type: 'datetime', name: 'end_time' })
  endTime: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Movies, (movies) => movies.movieTimesPrices)
  @JoinColumn({ name: 'movie_id' })
  movies: Movies;
}
