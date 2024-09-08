import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from 'src/entities/movie.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { Genres } from 'src/entities/genres.entity';
import { Schedules } from 'src/entities/schedule.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movies, Genres, Schedules]),
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
