import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { movieTimesPrice } from 'src/entities/movieTimesPrice.entity';
import { Repository } from 'typeorm';
import { InsertMovieTimesPriceDto } from './dto/response/insert-movieTimesPrices.dto';
import { InsertMovieTimesPriceResponse } from './dto/resquest/insert-movieTimesPrices.dto';
import * as moment from 'moment-timezone';
import 'moment/locale/vi';

@Injectable()
export class MovieTimesPriceService {
  constructor(
    @InjectRepository(movieTimesPrice)
    private movieTimesPriceRepository: Repository<movieTimesPrice>,
  ) {}

  async getMTP(id: number) {
    const result = await this.movieTimesPriceRepository.findOne({
      where: {
        id,
      },
      relations: ['movies'],
    });
    return result;
  }

  async getMTPs() {
    const result = await this.movieTimesPriceRepository.find({
      relations: ['movies'],
    });
    return result;
  }

  async addMTP(
    data: InsertMovieTimesPriceDto,
  ): Promise<InsertMovieTimesPriceResponse> {
    moment.locale('vi');
    const { movieId, startTime, endTime, unitPrice } = data;

    // Chuyển đổi startTime và endTime sang múi giờ Việt Nam (Asia/Ho_Chi_Minh)
    const startTimeVN = moment.tz(startTime, 'Asia/Ho_Chi_Minh').toDate();
    const endTimeVN = moment.tz(endTime, 'Asia/Ho_Chi_Minh').toDate();

    // Kiểm tra xem có bất kỳ lịch chiếu nào trùng lặp với thời gian muốn thêm vào
    const overlappingSchedule = await this.movieTimesPriceRepository
      .createQueryBuilder('mtp')
      .where('mtp.movieId = :movieId', { movieId })
      .andWhere('(:startTime < mtp.endTime AND :endTime > mtp.startTime)', {
        startTime: startTimeVN,
        endTime: endTimeVN,
      })
      .getOne();

    if (overlappingSchedule) {
      throw new BadRequestException(
        'Đã có lịch chiếu cho bộ phim này trong khoảng thời gian được cung cấp.',
      );
    }

    // Tạo lịch chiếu mới
    const newSchedule = this.movieTimesPriceRepository.create({
      movieId,
      startTime: startTimeVN,
      endTime: endTimeVN,
      unitPrice,
    });

    return await this.movieTimesPriceRepository.save(newSchedule);
  }

  async updateMTP(id: number, data: InsertMovieTimesPriceDto): Promise<string> {
    const getId = await this.movieTimesPriceRepository.findOne({
      where: { id },
    });
    if (!getId) {
      throw new NotFoundException(`không tìm thấy movie với id ${id}`);
    }
    const update = this.movieTimesPriceRepository.merge(getId, data);
    await this.movieTimesPriceRepository.save(update);
    return 'đã cập nhật thành công';
  }

  async deleteMTP(id: number): Promise<string> {
    await this.movieTimesPriceRepository.softRemove({ id });
    return 'đã xóa thành công';
  }

  async getMovieInMTP(movieId: number) {
    const result = await this.movieTimesPriceRepository.find({
      where: {
        movieId,
      },
      relations: ['movies'],
    });
    return result;
  }
}
