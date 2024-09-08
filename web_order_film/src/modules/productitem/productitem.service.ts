import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { ProductItem } from 'src/entities/productIteam.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { In, Like, Repository } from 'typeorm';
import { InsertProductItemResponse } from './dto/response/insert-productitem.dto';
import { InsertProductItemDto } from './dto/request/insert-productitem.dto';
import { Products } from 'src/entities/product.entity';

@Injectable()
export class ProductItemService {
  constructor(
    @InjectRepository(ProductItem)
    private productItemReponsitory: Repository<ProductItem>,
    @InjectRepository(Category)
    private categoryReponsitory: Repository<Category>,
    @InjectRepository(Supplier)
    private supplierReponsitory: Repository<Supplier>,
    @InjectRepository(Products)
    private productsReponsitory: Repository<Products>,
  ) {}

  async getProductItemName(name: string): Promise<ProductItem[]> {
    return this.productItemReponsitory.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async getProductItem(id: number) {
    const result = await this.productItemReponsitory.findOne({
      where: { id },
      relations: ['category', 'supplier', 'products'],
    });
    return result;
  }

  async getProductItems(): Promise<ProductItem[]> {
    const result = await this.productItemReponsitory.find({
      relations: ['category', 'supplier', 'products'],
    });
    return result;
  }

  async addProductItem(
    data: InsertProductItemDto,
    imageFile: Express.Multer.File,
  ): Promise<InsertProductItemResponse> {
    const { categoryId, supplierId, productIds, ...rest } = data;
    let imageUrl: string;
    if (imageFile) {
      imageUrl = imageFile.path;
    }
    const newProductItem = this.productItemReponsitory.create({
      ...rest,
      imageUrl: imageUrl,
    });
    if (data.categoryId) {
      const category = await this.categoryReponsitory.findOne({
        where: { id: categoryId },
      });
      newProductItem.category = category;
    }
    if (data.supplierId) {
      const supplier = await this.supplierReponsitory.findOne({
        where: { id: supplierId },
      });
      newProductItem.supplier = supplier;
    }
    if (data.productIds) {
      const products = await this.productsReponsitory.find({
        where: { id: In(productIds) },
      });
      newProductItem.products = products;
    }
    const saveProductItem =
      await this.productItemReponsitory.save(newProductItem);
    return saveProductItem;
  }

  async updateProductItem(
    id: number,
    data: InsertProductItemDto,
    imageFile: Express.Multer.File,
  ): Promise<string> {
    const getId = await this.productItemReponsitory.findOne({ where: { id } });
    if (!getId) {
      throw new NotFoundException(`Không tìm thấy ProductItem với id ${id}`);
    }
    let imageUrl: string;
    if (imageFile) {
      imageUrl = imageFile.path;
      data.imageUrl = imageUrl;
    }
    const update = this.productItemReponsitory.merge(getId, data);
    await this.productItemReponsitory.save(update);
    return 'đã cập nhật thành công';
  }

  async deleteProductItem(id: number): Promise<string> {
    await this.productItemReponsitory.softRemove({ id });
    return 'đã xóa thành công';
  }
}
