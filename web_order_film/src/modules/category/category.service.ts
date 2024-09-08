import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { InsertCategoryDto } from './dto/request/insert-category.dto';
import { InsertCategoryResponse } from './dto/response/insert-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategory(id: number) {
    const result = await this.categoryRepository.findOne({
      where: { id },
      relations: ['productItems.products'],
    });

    if (result) {
      const uniqueProducts = new Map();

      // Kết hợp tất cả sản phẩm vào Map để loại bỏ trùng lặp
      result.productItems.forEach((item) => {
        item.products.forEach((product) => {
          if (!uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, product);
          }
        });
      });

      // Chuyển Map thành mảng
      const products = Array.from(uniqueProducts.values());

      return {
        id: result.id,
        name: result.name,
        products,
      };
    }

    return null; // Hoặc xử lý lỗi nếu không tìm thấy danh mục
  }

  async getCategories(): Promise<any[]> {
    const categories = await this.categoryRepository.find({
      relations: ['productItems.products'],
    });

    return categories.map((category) => {
      const uniqueProducts = new Map();
      category.productItems.forEach((item) => {
        item.products.forEach((product) => {
          if (!uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, product);
          }
        });
      });
      const products = Array.from(uniqueProducts.values());

      return {
        id: category.id,
        name: category.name,
        products,
      };
    });
  }

  async addCategory(data: InsertCategoryDto): Promise<InsertCategoryResponse> {
    await this.categoryRepository.create(data);
    const saveCategory = await this.categoryRepository.save(data);
    return saveCategory;
  }

  async updateCategory(id: number, data: InsertCategoryDto): Promise<string> {
    const getId = await this.categoryRepository.findOne({ where: { id } });
    if (!getId) {
      throw new NotFoundException(`không tìm thấy typeseat với id ${id}`);
    }
    const update = this.categoryRepository.merge(getId, data);
    await this.categoryRepository.save(update);
    return 'đã cập nhật thành công';
  }

  async deleteCategory(id: number): Promise<string> {
    await this.categoryRepository.softRemove({ id });
    return 'đã xóa thành công';
  }
}
