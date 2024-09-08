import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { movieTimesPrice } from 'src/entities/movieTimesPrice.entity';
import { MovieTimesPriceController } from './movieTimesPrices.controller';
import { MovieTimesPriceService } from './movieTimesPrices.service';

@Module({
  imports: [TypeOrmModule.forFeature([movieTimesPrice])],
  controllers: [MovieTimesPriceController],
  providers: [MovieTimesPriceService],
})
export class MovieTimesPriceModule {}
