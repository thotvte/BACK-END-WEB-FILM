import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from 'src/entities/supplier.entity';
import { Repository } from 'typeorm';
import { InsertSupplierDto } from './dto/request/insert-supplier.dto';
import { InsertSupplierResponse } from './dto/response/insert-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async getSupplier(id: number) {
    const result = await this.supplierRepository.findOne({
      where: { id },
      relations: ['productItems.products'],
    });

    if (result) {
      const uniqueProducts = new Map();

      result.productItems.forEach((item) => {
        item.products.forEach((product) => {
          if (!uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, product);
          }
        });
      });

      return {
        id: result.id,
        name: result.name,
        products: Array.from(uniqueProducts.values()), // Trả về danh sách sản phẩm duy nhất
      };
    }

    return null; // Hoặc xử lý lỗi nếu không tìm thấy nhà cung cấp
  }
  async getSuppliers(): Promise<any[]> {
    const suppliers = await this.supplierRepository.find({
      relations: ['productItems.products'],
    });

    return suppliers.map((supplier) => {
      const uniqueProducts = new Map();

      supplier.productItems.forEach((item) => {
        item.products.forEach((product) => {
          if (!uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, product);
          }
        });
      });

      return {
        id: supplier.id,
        name: supplier.name,
        products: Array.from(uniqueProducts.values()), // Chỉ giữ lại sản phẩm duy nhất
      };
    });
  }

  async addSupplier(data: InsertSupplierDto): Promise<InsertSupplierResponse> {
    await this.supplierRepository.create(data);
    const saveSupplier = await this.supplierRepository.save(data);
    return saveSupplier;
  }

  async updateSupplier(id: number, data: InsertSupplierDto): Promise<string> {
    const getId = await this.supplierRepository.findOne({ where: { id } });
    if (!getId) {
      throw new NotFoundException(`không tìm thấy Supplier với id ${id}`);
    }
    const update = this.supplierRepository.merge(getId, data);
    await this.supplierRepository.save(update);
    return 'đã cập nhật thành công';
  }

  async deleteSupplier(id: number): Promise<string> {
    await this.supplierRepository.softRemove({ id });
    return 'đã xóa thành công';
  }
}
